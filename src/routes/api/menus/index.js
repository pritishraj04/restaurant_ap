import { connectToDatabase } from "$lib/db.js";

// POST Method

export async function POST({ request }) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("restaurants");
    const restaurants = await collection.find({}).toArray();
    const menu = await request.json();
    // await collection.updateOne(menu);
    return {
      status: 200,
      body: {
        status: "Success",
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

export async function PUT({ request }) {
  const dbConnection = await connectToDatabase();
  const db = dbConnection.db;
  const collection = db.collection("restaurants");
  const restaurant = await request.json();

  await collection.updateOne(
    { code: restaurant.code },
    {
      $set: {
        name: restaurant.name,
        type: restaurant.type,
        address: restaurant.address,
        offer: restaurant.offer,
        locale: restaurant.locale,
        desc: restaurant.desc,
      },
    }
  );
  return {
    status: 200,
    body: {
      status: "Success",
    },
  };
}

// DELETE Method

export async function DELETE({ request }) {
  const dbConnection = await connectToDatabase();
  const db = dbConnection.db;
  const collection = db.collection("restaurants");
  const restaurant = await request.json();

  await collection.deleteOne({ code: restaurant.code });
  return {
    status: 200,
    body: {
      message: "Success",
    },
  };
}
