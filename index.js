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
        const reviews=await cursor.toArray();
        res.send(reviews);
        console.log(reviews)
      })


     // get review by user
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
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
  });



  app.put('/users/admin/:id', async (req, res) => {
    
  
    const id = req.params.id;
    const filter = { _id: ObjectId(id) }
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            role: 'admin'
        }
    }
    const result = await usersCollection.updateOne(filter, updatedDoc, options);
    res.send(result);
  })
    // // add item by customer
    // app.post('/allItems',async(req,res)=>{
    //   const review=req.body;
    //   const result=await itemsCollection.insertOne(review);
    //   res.send(result);
    // })

    // // get item details by id
    // app.get('/itemDetails/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const query={_id:ObjectId(id)}
    //   const itemDetails=await itemsCollection.findOne(query);
    //   res.send(itemDetails);
    // })

    // // add review on database
    // app.post('/review',async(req,res)=>{
    //   const review=req.body;
    //   const result=await reviewCollection.insertOne(review);
    //   console.log(result)
    //   res.send(result);
    // })

    // // get review by id
    // app.get('/review',async(req,res)=>{
      
    //   let  query={};
    //   // console.log(req.query.email)
    //   if(req.query.item){
    //     query={
    //       item:req.query.item
    //     }
    //   }
      
    //   const cursor=reviewCollection.find(query);
    //   const review=await cursor.sort({_id:-1}).toArray();
    //   console.log(review)
    //   res.send(review);
    // })

    // // get review by user
    // app.get('/userReview',verifyJWT,async(req,res)=>{
    //   const decoded=req.decoded;
    //   if(decoded.email !== req.query.email){
    //     return res.status(403).send({message:'unauthorized access'})
    //   }
    //   let query={};
    //   if(req.query.email){
    //     query={
    //       email:req.query.email
    //     }
    //   }
    //   const cursor=reviewCollection.find(query);
    //   const reviews=await cursor.toArray();
    //   res.send(reviews);
    // })


    // delete review
    // app.delete('/userReview/:id',async(req,res)=>{
    //   const id= req.params.id;
    //   const query={_id:ObjectId(id)}
    //   const result=await reviewCollection.deleteOne(query);
    //   console.log(result)
    //   res.send(result);
    // })


    // update review
    // app.put('/userReview/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const status=req.body.status;
    //   const query={_id:ObjectId(id)}
    //   const updatedReview={
    //     $set:{
    //       message:status
    //     }
    //   }
      
    //   const result = await reviewCollection.updateOne(query,updatedReview);
    //   res.send(result);
    // })

  }finally{

  }
}
run().catch(err=>console.log(err));



 app.listen(port, () => {
     console.log(` port ${port}`)
   })