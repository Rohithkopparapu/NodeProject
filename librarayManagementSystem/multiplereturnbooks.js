const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libarayManagementSystem');

const multiReturnSchema = new mongoose.Schema({

   studentId: String,
   books: [
      {
         librarianId: String,
         bookId: String,
         bookname: String,
         categoryId: String,
         categoryName: String,
         issuedate: {
            type: Date,
         }, // New field
         duedate: {
            type: Date,
         }    // New field
      }
   ],
   returnDate: {
      type: Date,
   },
   numberOfDays: Number,
   charges: Number
})


const multireturnbookModel = mongoose.model('multireturnbooks', multiReturnSchema, 'multireturnbooks');


module.exports = multireturnbookModel;