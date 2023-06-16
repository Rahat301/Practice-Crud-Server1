const express = require('express')
const app = express()
const port = process.env.PORT || 8000
// const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const cors = require('cors')
app.use(cors())
app.use(express.json())

// get
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

//whne using dotnev env then use template string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb-1.dicfjcd.mongodb.net/?retryWrites=true&w=majority`; 

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
    await client.connect();

    const database = client.db("Practice");
    const UserCollection = database.collection("UserCollection");
   

    //post step-1
    app.post("/users",async(req,res)=>{
      const newUser = req.body;
      const result = await UserCollection.insertOne(newUser);

      //akon eta post mehthod e jaba font end-e data=> {ervitor kicu kaj kora jaba}
      res.json(result)
    
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);

    })

    //get api here find korbo step-2
     
    app.get("/users",async(req,res)=>{
      const  cursor = UserCollection.find({})
      const user = await cursor.toArray()
      res.send(user);
    })

    // delete api step-3
    app.delete("/users/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await UserCollection.deleteOne(query);

        // frontend e use korar jonno
        res.json(result)

    })

    //single user view get api and find korbo mongdb step-4 ans step-5 same update er jonno
    app.get("/users/:id",async(req,res)=>{
      const id= req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await UserCollection.findOne(query)
      
      res.json(result);

    })

    //update api step-5.1 and put use; and  mongodb use filter;

    app.put('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const updateUser = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          name: updateUser.name,
          email:updateUser.email,
        },
      };
      const result = await UserCollection.updateOne(filter, updateDoc, options);

      res.json(result)

    })
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})