const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Products');

const newSchema = new mongoose.Schema({
    name:String,
    department:String,
    technology:String,
    empId:String,
    projectAssign:String
})

const detailModel = mongoose.model('employeedetails',newSchema);

module.exports = detailModel;