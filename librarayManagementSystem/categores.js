const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/libarayManagementSystem');

const categorySchema = new mongoose.Schema({
    categoryname: {
        type: String,
        required: true,
        unique: true
    },
    books: [
        {
            title: {
              type: String,
              required: true,
            },
        },
    ],
    booksCount: {
        type: Number,
        default: 0
    },
    currentBookCount:{
        type: Number,
        default: 0
    }
})

categorySchema.pre('save', function (next) {
    this.booksCount = this.books.length;
    this.currentBookCount = this.books.length; 
    next();
});
const categoryModel= mongoose.model('categories',categorySchema);

module.exports = categoryModel;