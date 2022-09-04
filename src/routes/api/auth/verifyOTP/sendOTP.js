import dotenv from "dotenv";
import { connectToDatabase } from "$lib/db.js";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import * as cookie from "cookie";

dotenv.config();

export async function POST({ request }) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("otpVerification");
    const userCollection = db.collection("ap_users");
    let { email, resend } = await request.json();

    if (!email) {
      email = cookie.parse(request.headers.get("cookie")).email;
    }
    const userData = await userCollection.findOne({ email });
    const id = userData._id.toString();

    if (!email || !id) {
      throw Error("Could not find email of null");
    } else {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const salt = await bcrypt.genSalt(10);
      const hashedOTP = await bcrypt.hash(otp, salt);
      const otpAttempt = await collection.findOne({ email: email });
      if (!otpAttempt) {
        // await collection.createIndex(
        //   { createdAt: 1 },
        //   { expireAfterSeconds: 300 }
        // );
        await collection.insertOne({
          userId: id,
          email: String(email).toLowerCase(),
          otp: hashedOTP,
          resend: resend,
          userAttemptLeft: 4,
          resendAttemptLeft: 4,
          createdAt: new Date(),
          expiresAt: Date.now() + 300000,
        });
      } else {
        if (
          otpAttempt.resendAttemptLeft > 0 &&
          otpAttempt.userAttemptLeft > 0
        ) {
          const attempt = (otpAttempt.resendAttemptLeft -= 1);
          await collection.updateOne(
            { email: email },
            {
              $set: {
                otp: hashedOTP,
                resend: resend,
                resendAttemptLeft: attempt,
                createdAt: new Date(),
                expiresAt: Date.now() + 180,
              },
            }
          );
        } else if (otpAttempt.userAttemptLeft == 0) {
          return {
            status: 400,
            body: {
              error:
                "Maximum user attempt reached. </br>Please try again after 5 minutes.",
            },
          };
        } else if (otpAttempt.resendAttemptLeft == 0) {
          return {
            status: 400,
            body: {
              error:
                "Maximum OTP send request reached. </br>Please try again after 5 minutes.",
            },
          };
        }
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: process.env.AUTH_EMAIL,
        subject: "Verify Your Email",
        text: `Enter ${otp}`,
        html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete your registration.</p><br/><p>This code will expire in 1 hours.</p>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    return {
      status: 200,
      body: {
        success: "Otp has been sent. Check your email.",
        location: "/auth/register/verifyOTP",
      },
      headers: {
        "set-cookie": `email=${email}; SameSite=Strict; Max-Age=${3600}`,
      },

      // redirect: "/auth/register/verifyOTP",
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        error: `${err}`,
      },
    };
  }
}
