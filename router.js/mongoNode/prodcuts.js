const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Products');

const prodcutsSchema = new  mongoose.Schema({
    firstname:String,
    lastName:String,
    email:String,
    age:Number,
    gender:String,
    location:String
})

module.exports = mongoose.model("NodeProducts",prodcutsSchema,"NodeProducts");