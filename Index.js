const express = require('express')
const app = express()
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdpza.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const cors = require('cors');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
  const destinationsCollection = client.db("TravelAgency").collection("destinations");
  const reviewsCollection = client.db("TravelAgency").collection("reviews");
  const adminsCollection = client.db("TravelAgency").collection("admins");

  
    app.get('/destinations', (req,res) => {
      destinationsCollection.find()
      .toArray((err,items) => {
        res.send(items);
      })
    })

  app.post('/addDestination', (req,res) => {
    const newDestination = req.body;
    destinationsCollection.insertOne(newDestination)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


  app.get('/reviews', (req,res) => {
    reviewsCollection.find()
    .toArray((err,items) => {
      res.send(items);
    })
  })

app.post('/addReview', (req,res) => {
  const newReview = req.body;
  reviewsCollection.insertOne(newReview)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
})

app.post('/addAdmins', (req,res) => {
  const newAdmin = req.body;
  adminsCollection.insertOne(newAdmin)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
})

app.post ('/isAdmin',(req, res) =>{
  const name = req.body.name;
  adminsCollection.find({name: name })
  .toArray((err, documents)=>{
    res.send(documents.length > 0);
    
  })
})

app.delete('/delete/:id', (req, res)=>{
  destinationsCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result =>{
    console.log(result);
  })
 
})







});





app.listen(port, () => {
  console.log('iam connected');
})