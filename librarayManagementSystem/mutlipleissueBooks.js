const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libarayManagementSystem');

const mutlipleIssueSchema = new mongoose.Schema({
    librarianId:String,     
    studentId:String,
    books:[
      {
        categoryId:String,
        categoryName:String,
        bookId:String,
        bookname:String,
      }
    ],
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
 }

 
})


const multipleissueModel = mongoose.model('issuedbooks',mutlipleIssueSchema,'issuedbooks');
module.exports = multipleissueModel;