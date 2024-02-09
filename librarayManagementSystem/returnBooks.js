const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libarayManagementSystem');

const returnSchema = new mongoose.Schema({
    librarianId:String,
    bookId:String,
   bookname:String,
   studentId:String,
   categoryId:String,
   categoryName:String,
   issueDate: {
    type: Date,
    default: Date.now
 },
 dueDate: {
    type: Date,
    default: function() {
       const dueDate = new Date();
       dueDate.setDate(this.issueDate.getDate() + 5); 
       return dueDate;
    }
 },
 returnDate:{
    type: Date,
 },
 numberOfDays:Number,
 charges:Number
})


const returnbookModel = mongoose.model('returnbooks',returnSchema,'returnbooks');


module.exports = returnbookModel;