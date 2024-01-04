const mongoose = require('mongoose');
const express = require('express');
const app = express();
const prodcuts = require('./prodcuts.js');
mongoose.connect('mongodb://localhost:27017/Products');

app.use(express.json());

app.post('/create',async (req,res)=>{

    let model = new  prodcuts(req.body);
    let result = await model.save();
    if(result.acknowledged){
        res.status(200).json("Inserted");
    }
})


app.get('/list', async (req,res)=>{
    let result = await prodcuts.find();
    res.json(result);
    
})

app.get('/list/:key', async (req,res)=>{
    let result = await prodcuts.find({
        "$or":[
            {"firstname":{$regex:req.params.key}},
            {"lastName":{$regex:req.params.key}},
            
        ]
    });
    res.json(result);
    
})


app.put('/list/:email', async (req,res)=>{
    let model = await prodcuts.updateOne({email:req.params.email},{$set:req.body});
    if(model.acknowledged){
    res.status(200).json('Updated');
    }
})

app.listen(8000,console.log('Listening'));