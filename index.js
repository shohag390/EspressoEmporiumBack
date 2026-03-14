const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@espressoemporium.cedue8v.mongodb.net/?appName=EspressoEmporium`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("EspressoEmporium");
    const usersCollection = database.collection("users");
    const coffeeCollection = database.collection("coffees");

    // Root Route
    app.get("/", (req, res) => {
      res.send("Hello from Express Server");
    });

    // Create Users
    app.post("/users", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get Users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Delete Users
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Update Users by Login user
    app.patch("/users", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };
      const updatedDoc = {
        $set: {
          lastSignInTime: lastSignInTime,
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Get Coffees
    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    // Get Coffees By id
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // Add Coffee
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Delete Coffee
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Update Coffee
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;

      const result = await coffeeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCoffee },
      );
      res.send(result);
    });

    //
  } finally {
  }
}
run();

// app.listen(port, () => {
//   console.log(`Express server is running on port: ${port}`);
// });
