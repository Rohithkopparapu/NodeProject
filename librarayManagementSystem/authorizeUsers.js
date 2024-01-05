const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libarayManagementSystem');
const users = require('./users.js');
var deatilsOfuserlogin={};

const verifyUser = async (req,res,next) => {
    let {phone,password} = req.query;
    let data = await users.find();  
    let filteredResult = data.filter(item => (item.phone === phone || item.email === phone )&& (item.password === password || item.password === parseInt(password)));
     if(filteredResult.length > 0){
       filteredResult = filteredResult.map(user=>({
        id:user.id,
        name:user.name,
        phone:user.phone,
        role:user.role
       }))
       deatilsOfuserlogin=filteredResult[0];
       console.log(deatilsOfuserlogin);
       next();
    }
    else{
        res.status(400).json({
            message:"Invalid Credintails"
        })
    }
}

const verifyUserByEmail = async (req,res,next) => {
    let {email,password} = req.query;
    let data = await users.find();  
    let filteredResult = data.filter(item => (item.email === email )&& (item.password === password || item.password === parseInt(password)));
     if(filteredResult.length > 0){
       filteredResult = filteredResult.map(user=>({
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
       }))
       deatilsOfuserlogin=filteredResult[0];
       console.log(deatilsOfuserlogin);
       next();
    }
    else{
        res.status(400).json({
            message:"Invalid Credintails"
        })
    }
}

function details()
{
    return deatilsOfuserlogin;
}

module.exports = {verifyUser,details,verifyUserByEmail};
