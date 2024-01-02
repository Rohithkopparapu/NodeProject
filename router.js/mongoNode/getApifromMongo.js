
const getData = require('./mongoconnection.js');
const express = require('express');
const connection = require('./mongoConnect.js');
const app = express();

app.use(express.json());

app.get('/productslist', async(req,res)=>{
      let values = await getData();
      res.status(200).json(values);
})

app.post('/productslist',async (req,res)=>{
    let db = await connection();
  let result = await db.insertOne(req.body)
    if(result.acknowledged){
        res.status(200).json('Inserted Sucessfully');
    }
})

app.put('/productslist/:email',async (req,res)=>{
    let db = await connection();
    const result= await db.updateOne(
        {email:req.params.email},{$set:req.body},
    );
    if(result.acknowledged){
     res.status(200).json('Updated Sucessfully');
    }
})

app.delete('/productslist/:email',async (req,res)=>{
    let db = await connection();
    const result= await db.deleteOne({email:req.params.email});
    if(result.acknowledged){
        res.json("deleted Sucessfully");
    }
})

app.listen(8000,console.log('Listening'));
