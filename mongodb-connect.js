import express from 'express';
import { MongoClient } from 'mongodb';


const app = express();

const dbName = "collage"
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    const db = client.db(dbName);
    const collection = db.collection('students');
    const result = await collection.find({}).toArray();
    console.log('Students:', result);
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

connectToDatabase();

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});