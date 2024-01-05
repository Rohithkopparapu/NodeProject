require('dotenv').config();
const users = require('./users.js');
const express = require('express');
const app = express();
const { verifyUser, details, verifyUserByEmail } = require('./authorizeUsers.js');
const jwttoken = require('jsonwebtoken');
const secrectkey = "secrectkey";

app.use(express.json());

app.post('/login',verifyUser, (req, res) => {

    let value = details;
    jwttoken.sign({ value }, secrectkey, { expiresIn: '3600s' }, (err, token) => {
        res.json({
            "token": token
        })
        console.log(deatils);
    })
})

app.post('/login/email', verifyUserByEmail, (req, res) => {

    let value = details;
    jwttoken.sign({ value }, secrectkey, { expiresIn: '3600s' }, (err, token) => {
        res.json({
            "token": token
        })
        console.log(deatils);
    })
})


app.post('/userdetails', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(401).send('Invalid token');
        } else {

            let data = new users(req.body);
            let result = await data.save();
            console.log(result);
            if (result) {
                res.status(200).json({ message: 'Data inserted successfully' });
            } else {
                res.status(500).json({ error: 'Failed to save data' });
            }

        }
    });
});

app.get('/userdetails', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(401).send('Invalid token');
        } else {
            let data = await users.find();
            if (data) {

                res.status(200).json(data);
            }
            else {
                res.status(500).json({ error: 'Failed to load data' });
            }
        }
    });
});

app.put('/userdetails/:_id', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(401).send('Invalid token');
        } else {
            let data = await users.updateOne(
                { _id: req.params._id }, { $set: req.body },

            )
            if (data.acknowledged) {
                res.status(200).json({ message: "Data updated" });
            }
            else {
                res.status(400).json({ message: "Failed to Updated data" });
            }
        }
    });
});

app.delete('/userdetails/:_id', [verifyJWTtoken], async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(401).send('Invalid token');
        } else {
            if (details().role === 'Admin' && details().id !== req.params._id) {
                let data = await users.deleteOne({ _id: req.params._id });
                if (data) {
                    res.status(200).json({ message: 'Deleted Sucessfully' });
                }
            }
            else if (details().role === 'Librarian') {
                let data = await users.find();
                console.log(data);
                let idbasedObject = data.find(user => user._id === req.params._id);
                console.log(idbasedObject);
                if (idbasedObject.role === 'Student') {
                    let data = await users.deleteOne({ _id: req.params._id });
                    if (data) {
                        res.status(200).json({ message: 'Deleted Sucessfully' });
                    }
                }
                else {
                    res.status(400).json({ message: 'Records Will be deleted by Librarian only' });
                }
            }
            else {
                res.status(400).json({ message: "Records Will be deleted by Admin only." })
            }
        }
    });
});

function verifyJWTtoken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    }
    else {
        res.json({
            result: "Token is invalid"
        })
    }
}

app.listen(8000, console.log('Listening port 8000'));