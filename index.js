const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// all midelwere is here
app.use(cors());
app.use(express.json());



// Monodb connection is here
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Password}@cluster0.85env82.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,{
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

        const AllToys = client.db("PlayCarZone").collection("alltoys");

        // search from all toys route is here
        app.get("/searchalltoys/:text",async(req,res)=>{
            try {
              const search = req.params.text;
              const query = {name: {$regex: search, $options:"i"}};
              const result = await AllToys.find(query).toArray();
              res.send(result);
            } catch (error) {
              console.log(error);
            }
        });

        app.get('/discounttoy', async(rq,res)=>{
          try {
            const result = await AllToys.find().limit(6).toArray();
            res.send(result);
          } catch (error) {
            console.log(error);
          }
        });
        
        // get img from toy for gallery route here
        app.get("/galleryimg",async(req,res)=>{
          const query = {};
          const option = {
            projection : {thumbnail: 1}
          };

          const result = await AllToys.find(query, option).limit(18).toArray();
          res.send(result);
          
        });

        // get img from toy for gallery route here
        app.get("/alltoys",async(req,res)=>{
          try {
            const query = {};
            const option = {
              projection : {thumbnail: 1, name:1, price: 1, rating:1, catagory:1,quantity:1,sellername:1}
            };

            const result = await AllToys.find(query, option).toArray();
            res.send(result);
          } catch (error) {
            console.log(error);
          }
        });

        // get all toy all data for alltoys page route is here
        app.get("/alltoysdata",async(req,res)=>{
          try {
            const result = await AllToys.find().limit(20).toArray();
            res.send(result);
          } catch (error) {
            console.log(error);
          }
        });


        // get My toy all data for Mytoys page route is here
        app.get("/mytoysdata",async(req,res)=>{
          try {
            const emailaddress = req.query.email;
            const sorting = req.query.sorting;
            const sortnum = sorting== "assending" ? 1 : -1;
            const query = {selleremail: emailaddress}
            const result = await AllToys.find(query).sort({price: sortnum}).toArray();
            res.send(result);
          } catch (error) {
            console.log(error);
          }
        });


        // single toys details route is here
        app.get('/singletoydeatils/:id', async(req, res)=>{
          try {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await AllToys.findOne(query);
            res.send(result);
          } catch (error) {
            console.log(error);
          }
        });

        // Delete toy route is here
        app.delete("/deletetoy/:id", async(req, res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await AllToys.deleteOne(query);
          res.send(result);
        })

        // update toy data route is here
        app.post('/updatetoy/:id', async(req,res)=>{
            const id = req.params.id;
            const data = req.body;
            const  query = {_id: new ObjectId(id)};
            const updatedoucument = {
              $set: {
                price : data.price,
                quantity : data.quantity,
                description : data.description
              }
            };
            const result = await AllToys.updateOne(query,updatedoucument);
            res.send(result);
        });

        // post new toys route is here
        app.post("/inserttoy", async(req, res)=>{
          try {
            const toy = req.body;
            const result = await AllToys.insertOne(toy);
            res.send(result);
          } catch (error) {
            console.log(error);
          }
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
// Mongodb connection is end here




// default route is here
app.get("/",(req,res)=>{
    res.send("PlayCarZone server is running")
});

// app listen is here
app.listen(port, ()=>{
    console.log(`This server is running with ${port}`);   
});