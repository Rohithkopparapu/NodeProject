const mysql = require('mysql2');
const express = require('express');
const e = require('express');
const app = express();
const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"12345",
    database:"student"
});
app.use(express.json());
app.get("/student",(req,res)=>{
    const sql="SELECT * from users";
    db.query(sql,(err,data)=>{
        if(err){
            res.json("Error");
            console.log(err);
        }
        else{
            res.json(data);
        }
    })
})

app.post('/addstudent/student',(req,res)=>{
   
    if(!req.body ||  req.body.username === '' || req.body.email === ''){
        res.json('Name and Email Should not be Empty !');
    }
    else{
        console.log(req.body.username);
        const sql = `INSERT INTO users(username,email) VALUES ('${req.body.username}','${req.body.email}')`;
        db.query(sql,(err,data)=>{
            if(err){
                res.json('Err');
                console.log(err);
            }
            else{
                console.log("Inserted");
            }
        })
    }
})

app.put('/student/:id',(req,res)=>{
    if(req.params.id === ''){
       res.json('ID should not be empty');
    }
    else{
        const email = req.body.email;
        const sql = `UPDATE users SET email='${email}' WHERE id=${req.params.id}`;
        db.query(sql,(err,data)=>{
            if(err){
                res.json('ERROR');
            }
            else{
                res.json(data);
            }
        })
    }
})

// function insertRecords(){
//     // const sql = "INSERT INTO users(username,email) VALUES ('kopparapu','k@gmail.com')";
//     const sql ="UPDATE users SET email='akash@gmail.com' WHERE id=3";
//     db.query(sql,(err,data)=>{
//         if(err){
//            console.log(err);
//         }
//         else{
//           console.log("inserted");
//         }
//     })
// }

// insertRecords();


 app.listen(8090,console.log("listenning"));