import { connectToDatabase } from "$lib/db.js";
import bcrypt from "bcrypt";
import * as cookie from "cookie";

export async function POST({ request }) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("ap_users");
    const user = await request.json();
    const { email, password } = user;
    if (!email || !password) {
      return {
        status: 400,
        body: {
          error: "Please provide both email and password.",
        },
      };
    }
    const userData =
      (await collection.findOne({ email: String(email).toLowerCase() })) ||
      (await collection.findOne({ username: email }));

    if (userData && (await bcrypt.compare(password, userData.password))) {
      if (userData.verified) {
        return {
          status: 200,
          body: {
            username: userData.username,
            email: userData.email,
          },
          headers: {
            "Set-Cookie": cookie.serialize("session", userData._id, {
              path: "/",
              httpOnly: true,
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 60 * 24 * 30,
            }),
          },
        };
      } else {
        return {
          status: 400,
          body: {
            accountNotVerified: true,
            error: `Account is not verified. Please verify.`,
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          error: "Invalid Credential",
        },
      };
    }
  } catch (err) {
    return {
      status: 500,
      body: {
        error: `A server error occured: ${err}`,
      },
    };
  }
}

// user profile
