import { connectToDatabase } from "$lib/db.js";
import * as cookie from "cookie";
import { ObjectId } from "mongodb";

const dbConnection = await connectToDatabase();
const db = dbConnection.db;
const collection = db.collection("ap_users");

export const handle = async ({ event, resolve }) => {
  const cookieHeader = event.request.headers.get("cookie");
  const cookies = cookie.parse(cookieHeader ?? "");

  if (!cookies.session) {
    return await resolve(event);
  }

  const session = await collection.findOne({ _id: ObjectId(cookies.session) });

  if (session) {
    event.locals.user = { username: session.username, email: session.email };
  }
  return await resolve(event);
};

export const getSession = ({ locals }) => {
  if (!locals.user) return {};

  return {
    user: {
      username: locals.user.username,
      email: locals.user.email,
    },
  };
};
