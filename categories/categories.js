const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libarayManagementSystem');

const categoriesSchema = new mongoose.Schema({
    categoryname:String,
    quantity:Number
});

const categoryModel = mongoose.model('categories',categoriesSchema,'categories');

module.exports = categoryModel;