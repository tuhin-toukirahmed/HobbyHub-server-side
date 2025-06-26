const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // console.log('New group added:', result);
    res.status(201).json({ message: 'Group added successfully', result });
  } catch (err) {
    // console.error('Failed to add group:', err);
    res.status(500).json({ message: 'Failed to add group', error: err.message });
  }
});

app.get('/mygroups', async (req, res) => {
  try {
    const mygroupsCollection = client.db("mygroups").collection("mygroups");
    const groups = await mygroupsCollection.find().toArray();
    res.status(200).json(groups);
  } catch (err) {
    // console.error('Failed to fetch groups:', err);
    res.status(500).json({ message: 'Failed to fetch groups', error: err.message });
  }
});

// Get all groups created by a specific user (by email)
app.get('/mygroups/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const mygroupsCollection = client.db("mygroups").collection("mygroups");
    const groups = await mygroupsCollection.find({ email }).toArray();
    res.status(200).json(groups);
  } catch (err) {
    // console.error('Failed to fetch groups by email:', err);
    res.status(500).json({ message: 'Failed to fetch groups by email', error: err.message });
  }
});

// Get group details by groupId
app.get('/mygroups/details/:groupId', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const mygroupsCollection = client.db("mygroups").collection("mygroups");
    const group = await mygroupsCollection.findOne({ _id: new ObjectId(groupId) });
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
    } else {
      res.status(200).json(group);
    }
  } catch (err) {
    // console.error('Failed to fetch group details:', err);
    res.status(500).json({ message: 'Failed to fetch group details', error: err.message });
  }
});

// User collection APIs
app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const usersCollection = client.db("mygroups").collection("users");
    const result = await usersCollection.insertOne(newUser);
    // console.log('New user added:', result);
    res.status(201).json({ message: 'User added successfully', result });
  } catch (err) {
    // console.error('Failed to add user:', err);
    res.status(500).json({ message: 'Failed to add user', error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const usersCollection = client.db("mygroups").collection("users");
    const users = await usersCollection.find().toArray();
    res.status(200).json(users);
  } catch (err) {
    // console.error('Failed to fetch users:', err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const usersCollection = client.db("mygroups").collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    // console.error('Failed to fetch user:', err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

app.put('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const updateData = req.body;
    const usersCollection = client.db("mygroups").collection("users");
    const filter = { email: email };
    const update = { $set: updateData };
    const options = { upsert: false };
    const result = await usersCollection.updateOne(filter, update, options);
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User updated successfully', result });
    }
  } catch (err) {
    // console.error('Failed to update user:', err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

app.put('/mygroups/:groupId/:email', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const email = req.params.email;
    const updateData = req.body;
    const mygroupsCollection = client.db("mygroups").collection("mygroups");
    const filter = { _id: new ObjectId(groupId), email: email };
    const update = { $set: updateData };
    const options = { upsert: false };
    const result = await mygroupsCollection.updateOne(filter, update, options);
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Group not found or does not belong to this user' });
    } else {
      res.status(200).json({ message: 'Group updated successfully', result });
    }
  } catch (err) {
    // console.error('Failed to update group:', err);
    res.status(500).json({ message: 'Failed to update group', error: err.message });
  }
});

// Delete a group by groupId (only if it belongs to the user with the given email)
app.delete('/mygroups/:groupId/:email', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const email = req.params.email;
    const mygroupsCollection = client.db("mygroups").collection("mygroups");
    const filter = { _id: new ObjectId(groupId), email: email };
    const result = await mygroupsCollection.deleteOne(filter);
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Group not found or does not belong to this user' });
    } else {
      res.status(200).json({ message: 'Group deleted successfully' });
    }
  } catch (err) {
    // console.error('Failed to delete group:', err);
    res.status(500).json({ message: 'Failed to delete group', error: err.message });
  }
});

// Joined Groups collection APIs
app.post('/joined-groups', async (req, res) => {
  try {
    const newJoinedGroup = req.body;
    const joinedGroupsCollection = client.db("mygroups").collection("joinedGroups");
    const result = await joinedGroupsCollection.insertOne(newJoinedGroup);
    // console.log('New joined group added:', result);
    res.status(201).json({ message: 'Joined group added successfully', result });
  } catch (err) {
    // console.error('Failed to add joined group:', err);
    res.status(500).json({ message: 'Failed to add joined group', error: err.message });
  }
});

app.get('/joined-groups/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const joinedGroupsCollection = client.db("mygroups").collection("joinedGroups");
    const groups = await joinedGroupsCollection.find({ email }).toArray();
    res.status(200).json(groups);
  } catch (err) {
    // console.error('Failed to fetch joined groups:', err);
    res.status(500).json({ message: 'Failed to fetch joined groups', error: err.message });
  }
});

// Delete a joined group by its ObjectId and user email
app.delete('/joined-groups/:joinedGroupId/:email', async (req, res) => {
  try {
    const joinedGroupId = req.params.joinedGroupId;
    const email = req.params.email;
    const joinedGroupsCollection = client.db("mygroups").collection("joinedGroups");
    const filter = { _id: new ObjectId(joinedGroupId), email: email };
    const result = await joinedGroupsCollection.deleteOne(filter);
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Joined group not found or does not belong to this user' });
    } else {
      res.status(200).json({ message: 'Joined group deleted successfully' });
    }
  } catch (err) {
    // console.error('Failed to delete joined group:', err);
    res.status(500).json({ message: 'Failed to delete joined group', error: err.message });
  }
});

// Database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h1ieoou.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

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
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    // console.error("Failed to connect to MongoDB:", err);
  }
}
// run().catch(console.dir);

app.listen(port, () => {
  // console.log(`Server is running on http://localhost:${port}`);
});
