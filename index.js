const express=require('express');
const app = express();
const cors = require('cors');
const port =process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt=require('jsonwebtoken')
require('dotenv').config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.01makvu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)



// function verifyJWT(req,res,next){
//   const authHeader=req.headers.authorization;
//   // console.log(authHeader)
//   if(!authHeader){
//     return res.status(401).send({message:'unauthorized access'})
//   }
//   const token=authHeader.split(' ')[1];
//   // console.log(token)
//   jwt.verify(token,process.env.TOKEN,function(err,decoded){
//     if(err){
//       return res.status(401).send({message:'unauthorized access'})
//     }
//     // console.log(decoded)
//     req.decoded=decoded;
//     next();
//   })


// }










async function run(){
  try{
    const categoriesCollection = client.db("ComfortZone").collection("Categories");
    const productsCollection=client.db("ComfortZone").collection("Products");
    const addCollection=client.db("ComfortZone").collection("Advertise");
    const bookingsCollection=client.db("ComfortZone").collection("Bookings");
    const usersCollection=client.db("ComfortZone").collection("Users");
    
   //add product cullections
    app.get('/categories',async(req,res)=>{
      const query={};
      const categories=await categoriesCollection.find(query).toArray();
      res.send(categories);
    })
    //add user 

    app.get('/add',async(req,res)=>{
      const query={};
      const add=await addCollection.find(query).toArray();
      res.send(add);
    })
    

    app.post('/products',async(req,res)=>{
      const product=req.body;
      const result=await productsCollection.insertOne(product);
      res.send(result);
    })

    app.post('/bookings',async(req,res)=>{
      const product=req.body;
      const result=await bookingsCollection.insertOne(product);
      res.send(result);
    })



app.get('/categories/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:ObjectId(id)}
  const result=await categoriesCollection.findOne(query);
  res.send(result);
})


    app.get('/products',async(req,res)=>{
        
       const categorie=req.query.categories;
       const query={
        categories:categorie
       }
        const cursor=productsCollection.find(query);
        const products=await cursor.toArray();
        res.send(products);
       
      })

     app.get('/allUsers',async(req,res)=>{
      const query={};
      const categories=await usersCollection.find(query).toArray();
      
      // res.send(categories);
     })
        


     
     app.get('/orders',async(req,res)=>{
      
      let query={};
      if(req.query.email){
        query={
          email:req.query.email
        }
      }
      const cursor=bookingsCollection.find(query);
      const orders=await cursor.toArray();
      res.send(orders);
    })


     app.get('/myProducts',async(req,res)=>{
      
      let query={};
      if(req.query.email){
        query={
          email:req.query.email
        }
      }
      const cursor=productsCollection.find(query);
      const orders=await cursor.toArray();
      res.send(orders);
    })
    


    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
  });


  app.get('/users/seller/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email }
    const user = await usersCollection.findOne(query);
    // console.log(user)
    res.send({ isSeller: user?.candidate === 'Seller' });
  })

  app.get('/users/admin/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email }
    const user = await usersCollection.findOne(query);
    res.send({ isAdmin: user?.candidate === 'Admin' });
  })

  
    

  }finally{

  }
}
run().catch(err=>console.log(err));



 app.listen(port, () => {
     console.log(` port ${port}`)
   })