const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;

// app.use(cors());
app.use(express.json());

app.use(cors({
  origin:["http://localhost:5173","http://localhost:5174", "https://rangdhanu-art.netlify.app", "https://rangdhanuart.vercel.app"]
}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z7hla77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();

    const itemCollection = client.db('Rangdhanu').collection('art');
    const categoriesCollection = client.db('Rangdhanu').collection('categories');

    app.get('/item', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.findOne(query);
      res.send(result)
    })

    app.get('/categories', async (req, res) => {
      const cursor = categoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/item', async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await itemCollection.insertOne(newItem);
      res.send(result)
    })
   

    app.put('/item/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateCraft= req.body;
      const Craft = {
        $set: {
          itemName: updateCraft.itemName,
          subcategory: updateCraft.subcategory,
          image: updateCraft.image,
          price: updateCraft.price,
          rating: updateCraft.rating,
          customization: updateCraft.customization,
          processing_time: updateCraft.processing_time,
          stockStatus: updateCraft.stockStatus,
          description: updateCraft.description,
        }
      }

      const result = await itemCollection.updateOne(filter, Craft, options);
      res.send(result);
    })

    app.delete('/item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.deleteOne(query);
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello from Rangdhanu Art');
})


app.listen(port, () => {
  console.log(`My first server is running on port:${port}`);
})

