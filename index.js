const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/mygroups', async (req, res) => {
  try {
    const newGroup = req.body;
    const mygroupsCollection = client.db("mygroups").collection("mygroups");
    const result = await mygroupsCollection.insertOne(newGroup);
    console.log('New group added:', result);
    res.status(201).json({ message: 'Group added successfully', result });
  } catch (err) {
    console.error('Failed to add group:', err);
    res.status(500).json({ message: 'Failed to add group', error: err.message });
  }
});

app.get('/mygroups', async (req, res) => {
  try {
    const mygroupsCollection = client.db("mygroups").collection("mygroups");
    const groups = await mygroupsCollection.find().toArray();
    res.status(200).json(groups);
  } catch (err) {
    console.error('Failed to fetch groups:', err);
    res.status(500).json({ message: 'Failed to fetch groups', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1ieoou.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true // Force TLS/SSL
});

async function run() {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}
run().catch(console.dir);
