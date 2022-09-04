import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

// cached method

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env");
}
if (!MONGODB_DB) {
  throw new Error("Please add your Mongo DB to .env");
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// New method below

// const uri = process.env["MONGODB_URI"];
// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// };

// let client;
// let connectToDatabase;

// if (!uri) {
//   throw new Error("Please add your Mongo URI to .env");
// }

// if (process.env["NODE_ENV"] === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   connectToDatabase = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   connectToDatabase = client.connect();
// }

// export default connectToDatabase;
