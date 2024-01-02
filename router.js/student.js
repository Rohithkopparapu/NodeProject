const express = require('express');
const router=express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "student"
});

router.get("/", (req, res) => {
    const sql = "SELECT * from users";
    db.query(sql, (err, data) => {
        if (err) {
            res.json("Error");
            console.log(err);
        }
        else {

            const userDeatils = data.map((student) => {
                const { id, username } = student;
                return { id, username };
            })
            res.json(userDeatils);
      
        }
    })
})

router.get("/v1/list", (req, res) => {

    const sql = "SELECT * from users";
    db.query(sql, (err, data) => {
        if (err) {
            res.json("Error");
            console.log(err);
        }
        else {

            const { email, limit } = req.query;
            let sortedStudentsList = [...data];
            if (email) {
                sortedStudentsList = sortedStudentsList.filter(items => items.username.toLowerCase().includes(email.toLowerCase()));


            }
            if (limit) {
                sortedStudentsList = sortedStudentsList.slice(0, Number(limit));
            }
            if (sortedStudentsList.length < 1) {
                return res.status(404).json({
                    'sucess': true,
                    data: []
                });
            }
            res.json(sortedStudentsList);
        }
    })
})

router.get("/:name", (req, res) => {
    const sql = "SELECT * from users";
    db.query(sql, (err, data) => {
        if (err) {
            res.json("Error");
            console.log(err);
        }
        else {
            const filterStudent = data.filter(items => items.username.toLowerCase().includes(req.params.name.toLowerCase()) || items.email.toLowerCase().includes(req.params.name.toLowerCase()));
            if (filterStudent.length === 0) {
                res.json('No data Found');
            }
            else {
                res.json(filterStudent);
             
                // // res.sendFile(file,data);
                // res.append(data.toString(),file);
            }
        }
    })
})


module.exports = router;