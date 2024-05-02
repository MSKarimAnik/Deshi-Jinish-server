const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app =express();
const { ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


// middleware

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tr3hdho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const craftCollection = client.db('craftDB').collection('craft');


    // Get all info
    app.get('/craft', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    // Get info by ID
    app.get('/craft/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }; // Use ObjectId here
    const result = await craftCollection.findOne(query);
    if (!result) {
    return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.send(result);
    });


// Create new creaft
app.post('/craft', async (req, res) => {
  const formData= req.body;
  console.log(formData);
  const result = await craftCollection.insertOne(formData);
  res.send(result);
});

// Update info by ID
app.put('/craft/:id', async (req, res) => {
  const id = req.params.id;
  const updatedCraft = req.body;

  try {
    const query = { _id: new ObjectId(id) };
    const updateResult = await craftCollection.updateOne(query, { $set: updatedCraft });

    if (updateResult.modifiedCount === 1) {
      res.json({ status: "success", message: "Craft item updated successfully", updatedCraft });
    } else {
      res.status(404).json({ status: "error", message: "Craft item not found or no changes to update" });
    }
  } catch (error) {
    console.error("Error updating craft item:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Delete info by ID
app.delete('/craft/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }; // Use ObjectId here
  const result = await craftCollection.deleteOne(query);
  res.send(result);
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req, res)=>{
    res.send('DESHI JINISH server is running')
})

app.listen(port,()=>{
    console.log(`DESHI JINISH server is running on port:${port}` )
})