const express = require('express');
const app = express();
const prac = require('./prac.js');
const { authorize } = require('./Authorize.js');
const jwt = require('jsonwebtoken');
const secrectkey = "secrectkey"
app.use(express.json());

app.post('/login', authorize, (req, res) => {

    jwt.sign({}, secrectkey, { expiresIn: '300s' }, (err, token) => {
        if (token) {
            res.send({
                "token": token
            })
        }

    })

})

app.post('/empdetails', verifytoken, (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authDta) => {
        let model = new prac(req.body);
        let result = await model.save();
        if (result && authDta) {
            res.status(200).json("Record Inserted Sucessfully");
        }
        else
        {
            res.status(400).send('')
        }
    })

})

const verifytoken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    }
    else {
        res.send({
            message: "Invalid token"
        })
    }
}