import { connectToDatabase } from "$lib/db.js";

// GET Method

export async function GET() {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("restaurants");
    const restaurants = await collection.find({}).toArray();
    return {
      status: 200,
      body: await restaurants,
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

// POST Method

export async function POST({ request }) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("restaurants");
    const counterCollection = db.collection("counters");
    const restaurantCounter = await counterCollection
      .find({ counterFor: "restaurantCounter" })
      .toArray();
    let code;
    if (restaurantCounter.length != 0) {
      const lastCodeUsed = restaurantCounter[0].code;
      code = lastCodeUsed + 1;
    } else {
      code = 0;
    }
    const restaurant = { about: await request.json() };
    restaurant.about.code = code;

    const restaurantCounterData = {
      counterFor: "restaurantCounter",
      code: code,
    };

    await collection.insertOne(restaurant);
    if (restaurantCounter.length != 0) {
      await counterCollection.updateOne(
        { counterFor: "restaurantCounter" },
        { $set: { code: code } }
      );
    } else {
      await counterCollection.insertOne(restaurantCounterData);
    }
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
    { code: restaurant.about.code },
    {
      $set: {
        name: restaurant.about.name,
        type: restaurant.about.type,
        address: restaurant.about.address,
        offer: restaurant.about.offer,
        locale: restaurant.about.locale,
        desc: restaurant.about.desc,
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

  await collection.deleteOne({ "about.code": restaurant.code });
  return {
    status: 200,
    body: {
      message: "Success",
    },
  };
}
