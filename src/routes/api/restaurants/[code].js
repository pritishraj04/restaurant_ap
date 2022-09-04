import { connectToDatabase } from "$lib/db.js";

export async function GET({ params }) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("restaurants");
    const restaurants = await collection.findOne({
      "about.code": parseInt(params.code),
    });
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

// PUT Method

export async function PUT({ params, request }) {
  const dbConnection = await connectToDatabase();
  const db = dbConnection.db;
  const collection = db.collection("restaurants");
  const counterCollection = db.collection("counters");
  const menuCounter = await counterCollection
    .find({ counterFor: "menuCounter" })
    .toArray();
  let code = 0;
  const restaurant = await collection.findOne({
    "about.code": parseInt(params.code),
  });

  const menu = await request.json();
  const menuCounterData = {
    counterFor: "menuCounter",
    code: code,
  };
  const lastCodeUsed = menuCounter[0].code;
  for (let i = 0; i < menu.length; i++) {
    if (menuCounter.length != 0) {
      if (i == 0) {
        code = lastCodeUsed + 1;
        menu[i].code = code;
      } else {
        code += 1;
        menu[i].code = code;
      }
    } else {
      code = 0;
      menu[i].code = code;
      await counterCollection.insertOne(menuCounterData);
    }
  }

  await collection.updateOne(
    { "about.code": restaurant.about.code },
    {
      $push: {
        menus: {
          $each: menu,
        },
      },
    }
  );
  await counterCollection.updateOne(
    { counterFor: "menuCounter" },
    { $set: { code: code } }
  );
  return {
    status: 200,
    body: {
      status: "Success",
    },
  };
}
