const express = require('express');
const jwttoken = require('jsonwebtoken');
const app = express();
const secrectkey="secretkey";
const {authorize,filterArray} = require('./Authorize.js');
const data =[
    {
        id:1,
        name:'Rohith',
        dept:'SE'
    }
]

app.get('/',(req,res)=>{
    res.json(data);
})

app.post('/login',[authorize],(req,res)=>{
     jwttoken.sign({filterArray},secrectkey,{expiresIn:'300s'},(err,token)=>{    
       res.json({
        "token":token
        
       })
    })
})

app.post('/profile',verifyToken,(req,res)=>{
    jwttoken.verify(req.token,secrectkey,(err,authDta)=>{
        if(err)
        {
            res.status(401).send('Invalid token');
        }else{
            res.status(200).send("Valid")
        }
    })
})


function verifyToken(req,res,next) {
 const bearerHeader = req.headers['authorization'];
 console.log(bearerHeader);
 if(typeof bearerHeader !== 'undefined'){
    const  bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    console.log(token);
    next();
 }
 else{
    res.json({
        result:"Token is invalid"
    })
 }
}

// let student =[
//     {name:"Smith",age:31,marks:80},
//     {name:"Jenny",age:15,marks:69},
//    {name:"John",age:15,marks:35},
//   {name:"Tiger",age:7,marks:55}
//    ];

// const s=  student.reduce((acc,curr)=>{

//        const age = curr.age;

//        acc[age]=acc[age] || [];
//        acc[age].push(curr);
//        return acc;
//    },{})

// console.log(s);

app.listen(8000,console.log("Listening"));