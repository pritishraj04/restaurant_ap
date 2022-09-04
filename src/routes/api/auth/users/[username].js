import { connectToDatabase } from "$lib/db.js";
import bcrypt from "bcrypt";

export const PATCH = async ({ request }) => {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("ap_users");
    const passwordData = await request.json();
    const { username, password } = passwordData;
    if (!username) {
      return {
        status: 400,
        body: {
          error: `Username can't be empty.`,
        },
      };
    }
    if (!password) {
      return {
        status: 400,
        body: {
          error: `Password is required!`,
        },
      };
    }
    const userExists = await collection.findOne({ username });
    if (!userExists) {
      return {
        status: 400,
        body: {
          error:
            "We are not able to find the username.<br/> Try registering or use different username.",
        },
      };
    }
    if (await bcrypt.compare(password, userExists.password)) {
      return {
        status: 400,
        body: {
          error: "Password can not be same as the previous password.",
        },
      };
    }
    const validatePassword = (str) => {
      return (
        str.match(/[a-z]/g) &&
        str.match(/[A-Z]/g) &&
        str.match(/[0-9]/g) &&
        str.match(/[^a-zA-Z\d]/g) &&
        str.length >= 8
      );
    };
    if (!validatePassword(password)) {
      return {
        status: 400,
        body: {
          error: `<strong>Password should fulfil following criteria:</strong>
          <ul>
            <li>At least 1 uppercase character.</li>
            <li>At least 1 lowercase character.</li>
            <li>At least 1 digit.</li>
            <li>At least 1 special character.</li>
            <li>Minimum 8 characters.</li>
          </ul>`,
        },
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await collection.updateOne(
      { username: username },
      { $set: { password: hashPassword, updatedAt: new Date() } }
    );
    return {
      status: 200,
      body: {
        success: `Password has been updated!`,
        error: "",
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        error: `A server error occured: ${err}`,
      },
    };
  }
};
