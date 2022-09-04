import { connectToDatabase } from "$lib/db.js";
import bcrypt from "bcrypt";
import * as cookie from "cookie";

export async function POST({ request }) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("otpVerification");
    const userCollection = db.collection("ap_users");
    let email = cookie.parse(request.headers.get("cookie")).email;
    let { otp } = await request.json();

    if (!email || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const userOTPVerificationRecords = await collection.findOne({
        email: email,
      });
      if (!userOTPVerificationRecords) {
        throw new Error(
          "Account record does't exist or has been verified already. </br>Please Sign up or Sign in."
        );
      } else {
        if (userOTPVerificationRecords.userAttemptLeft == 0) {
          return {
            status: 400,
            body: {
              error:
                "Maximum user attempt reached. </br>Please try again after 5 minutes.",
            },
          };
        }
        const { expiresAt } = userOTPVerificationRecords;
        const hashedOTP = userOTPVerificationRecords.otp;
        if (expiresAt < Date.now()) {
          await collection.deleteMany({ email });
          throw new Error("Code has expired. Please request again.");
        } else {
          const attempt = (userOTPVerificationRecords.userAttemptLeft -= 1);
          const validOTP = await bcrypt.compare(otp.toString(), hashedOTP);
          if (!validOTP) {
            await collection.updateOne(
              { email: email },
              { $set: { userAttemptLeft: attempt } }
            );
            throw new Error("Invalid code entered. Check your inbox");
          } else {
            await userCollection.updateOne(
              { email: email },
              { $set: { verified: true } }
            );
            await collection.deleteMany({ email });
          }
        }
      }
    }

    return {
      status: 200,
      body: {
        status: "VERIFIED",
        success: "User email verified successfully",
      },
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
