const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libarayManagementSystem');

const usersSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password:String,
    DOB:String,
    gender:String,
    role:{
        type:String,
        enum:["Admin","Student","Librarian"]
      }
});

const userModel = mongoose.model('users',usersSchema,'users');

module.exports = userModel;