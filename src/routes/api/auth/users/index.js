import { connectToDatabase } from "$lib/db.js";
import bcrypt from "bcrypt";

// GET Method

// export async function GET() {
//   try {
//     const dbConnection = await connectToDatabase();
//     const db = dbConnection.db;
//     const collection = db.collection("restaurants");
//     const restaurants = await collection.find({}).toArray();
//     return {
//       status: 200,
//       body: await restaurants,
//     };
//   } catch (err) {
//     return {
//       status: 500,
//       body: {
//         error: `A server error occured: ${err}`,
//       },
//     };
//   }
// }

// POST Method

export async function POST({ request }) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("ap_users");
    const user = await request.json();
    const { username, email, password } = user;
    if (!username || !email || !password) {
      return {
        status: 400,
        body: {
          error: "All fields are required.",
        },
      };
    }
    if (username.length <= 3) {
      return {
        status: 400,
        body: {
          error: "Username should be equal to or more than 4 letters.",
        },
      };
    }
    const validateUsername = (str) => {
      return String(str).match(/^[a-zA-Z0-9]+$/);
    };
    if (!validateUsername(username)) {
      return {
        status: 400,
        body: {
          error:
            "Username is not valid. Only characters A-Z, a-z, 0-9 and '-' are  acceptable.",
        },
      };
    }
    const validateEmail = (str) => {
      return String(str)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (!validateEmail(email)) {
      return {
        status: 400,
        body: {
          error:
            "Email format should be correct.<br/> Example: example@domain.com",
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
    const emailExists = await collection.findOne({ email });
    const userExists = await collection.findOne({ username });

    if (emailExists) {
      return {
        status: 400,
        body: {
          error: "Email is already registered. Try signing in.",
        },
      };
    }

    if (userExists) {
      return {
        status: 400,
        body: {
          error:
            "Username is already being used.<br/> Try registering with different username.",
        },
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const userInserted = await collection.insertOne({
      username,
      email: String(email).toLowerCase(),
      password: hashPassword,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = {
      id: userInserted.insertedId.toString(),
      email: String(email).toLowerCase(),
    };

    return {
      status: 200,
      body: {
        success: `Account created using ${result.email}!<br/> You will be redirected to login page in a moment.<br/> You will need to verify your email before login.`,
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
}

// PUT Method

// export async function PUT({ request }) {
//   const dbConnection = await connectToDatabase();
//   const db = dbConnection.db;
//   const collection = db.collection("restaurants");
//   const restaurant = await request.json();

//   await collection.updateOne(
//     { code: restaurant.about.code },
//     {
//       $set: {
//         name: restaurant.about.name,
//         type: restaurant.about.type,
//         address: restaurant.about.address,
//         offer: restaurant.about.offer,
//         locale: restaurant.about.locale,
//         desc: restaurant.about.desc,
//       },
//     }
//   );
//   return {
//     status: 200,
//     body: {
//       status: "Success",
//     },
//   };
// }

// DELETE Method

// export async function DELETE({ request }) {
//   const dbConnection = await connectToDatabase();
//   const db = dbConnection.db;
//   const collection = db.collection("restaurants");
//   const restaurant = await request.json();

//   await collection.deleteOne({ "about.code": restaurant.code });
//   return {
//     status: 200,
//     body: {
//       message: "Success",
//     },
//   };
// }
