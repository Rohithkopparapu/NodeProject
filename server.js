// const mysql = require('mysql2');
const express = require('express');
const app = express();
// const logger = require('./logger.js');
// const authorize = require('./Authorize.js');
// const student = require('./router.js/student.js');

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "12345",
//     database: "student"
// });
// app.use(express.json());
// app.use('/student', logger);
// app.use([express.json(),logger]);

// app.use('/student',student);

app.use('',require('././librarayManagementSystem/apiforUsers.js'))

// app.post('/addstudent/student', (req, res) => {

//     if (!req.body || req.body.username === '' || req.body.email === '') {
//         res.json('Name and Email Should not be Empty !');
//     }
//     else {
//         console.log(req.body.username);
//         const sql = `INSERT INTO users(username,email) VALUES ('${req.body.username}','${req.body.email}')`;
//         db.query(sql, (err, data) => {
//             if (err) {
//                 res.json('Err');
//                 console.log(err);
//             }
//             else {
//                 console.log("Inserted");
//             }
//         })
//     }
// })

// app.put('/student/:id', (req, res) => {
//     if (req.params.id === '') {
//         res.json('ID should not be empty');
//     }
//     else {
//         const email = req.body.email;
//         const sql = `UPDATE users SET email='${email}' WHERE id=${req.params.id}`;
//         db.query(sql, (err, data) => {
//             if (err) {
//                 res.json('ERROR');
//             }
//             else {
//                 res.json(data);

//             }
//         })
//     }
// })




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


app.listen(8080, console.log("listenning"));