import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();

app.set('view engine', 'ejs');
const dbName = "collage";
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

let db; // Hold the database reference

// Route
app.get("/", async (req, resp) => {
  try {
     await client.connect();
    console.log('Connected successfully to MongoDB server');
    db = client.db(dbName);
    const collection = db.collection('students');
    const result = await collection.find({}).toArray();
    resp.render("usersCard", { users: result });
  } catch (err) {
    console.error("Error fetching data:", err);
    resp.status(500).send("Error loading students");
  }
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});