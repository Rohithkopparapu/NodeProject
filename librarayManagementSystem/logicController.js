const categoriesModel = require('./categores.js');
const express = require('express');
const router = express.Router();
const jwttoken = require('jsonwebtoken');
const categoryModel = require('./categores.js');
const secrectkey = "secrectkey";
const users = require("./users.js");
const mongoose = require('mongoose');

const issueModel = require("./issueBooks.js");
const returnbookModel = require('./returnBooks.js');
const mutlipleissueBooks = require('./mutlipleissueBooks.js');
const multireturnbookModel = require('./multiplereturnbooks.js');
const multipleissueModel = require('./mutlipleissueBooks.js');
const userModel = require('./users.js');

var issuebookArray = [];
var issueBooksPayload = {};
var updateIssueBook;
var returnbooks = [];
var multireturnbooks = [];
router.post("/addBooks", verifyJWTtoken, async (req, res) => {

    jwttoken.verify(req.token, secrectkey, async (err, authData) => {

        if (err) {
            res.status("Token Inavalid")
        }
        else if (authData.value.role === 'Admin') {
            let data = new categoriesModel(req.body);
            let result = await data.save();
            console.log(result);
            if (result) {
                res.status(200).json({ message: 'Data inserted successfully' });
            } else {
                res.status(500).json({ error: 'Failed to save data' });
            }
        }
        else {
            res.status(400).json({ message: "Categories can be craeted by Admin only." })
        }
    })
})

router.get('/getStudentlist',verifyJWTtoken,async(req,res)=>{
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status("Token Inavalid")
        }
        else if (authData.value.role === 'Admin' || authData.value.role === 'Librarian') {
            let data = await userModel.find({role:'Student'});
            if (data) {
                res.status(200).json({ message: 'Sucess',list: data });
            } else {
                res.status(500).json({ error: 'Failed to Load data' });
            }
        }
        else{
            res.status(400).json({ error: 'Librarian and Admin Can only access' });
        }
    })
})

router.post('/addStudent',verifyJWTtoken,async(req,res)=>{
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(200).json({ message: "Inavlid token" });
        }
        else{
         let newuser = req.body;
         if(newuser){
            let save = new userModel(newuser);
            let savenewuser = await save.save();
            if(savenewuser){
              res.status(200).json({message:'Student Details Added Scuessfully'});
            }
            else{
               res.status(501).json({message:'Internal Server Error'});
            }
         }else{
            res.status(400).json({message:'Please Provide All Details'});
         }
        }
    })
})

router.put('/students/:_id',verifyJWTtoken,async (req,res)=>{
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(200).json({ message: "Inavlid token" });
        }
        else{
          const librarianId= await userModel.find({_id:req.params._id});
          if(librarianId && librarianId.length > 0){
            let updates = req.body;
            if(Array.isArray(updates)  &&  updates.length > 0){
          const afterupdate=updates.map(async element => {
                const s = await userModel.updateOne({ _id: element._id }, { $set: element });
                return s;
             });       
             if(afterupdate.length > 0){
                res.status(200).json({message:'Record Update ScuessFully'});
             }
             else{
                res.status(400).json({message:'Updation Failed Internal Sever Error'});
             }

            }
            else{
            res.status(400).json({message:'Please Select AtLeast One Record'});
            }
          }
          else{
             res.status(400).json({message:'Admin or Librarian can only Update'});
          }
        }
    })
})

router.delete('/student/:_id',verifyJWTtoken, async(req,res)=>{
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(200).json({ message: "Inavlid token" });
        }
        else if(authData.value.role === 'Admin' || authData.value.role === 'Librarian'){
            const deleteStudentRecord = await userModel.deleteOne({_id:req.params._id});
            if(deleteStudentRecord){
               res.status(200).json({message:'Record Deleted Sucessfully'});
            }
            else{
                res.status(501).json({message:'Internal Server Error'});
            }
        }
        else{
            res.status(400).json({message:'Only Admin and Librarian are able to delete'});
        }
    })
})

router.get('/getBooks', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(200).json({ message: "Inavlid token" });
        }
        else {
            const books = await categoriesModel.find();
            if (books) {
                res.status(200).json(books);
            } else {
                res.status(501).json({ message: "Internal Server Error" });
            }
        }
    })
})

router.get('/getBooks/:categoryname', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid Token" });
        }
        else {
            // const books = await categoryModel.find({ categoryname: req.params.categoryname });
            const books = await categoryModel.find({
                categoryname: {
                    $regex: new RegExp(req.params.categoryname, 'i')
                }
            });

            if (books) {
                res.status(200).json(books);
            } else {
                res.status(501).json({ message: "Internal Server Error" });
            }
        }
    })
})

router.get('/studentusers',verifyJWTtoken,async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Inavlid token" });
        } else {
            let data = await users.find({role:'Student'});
            if (data) {

                res.status(200).json(data);
            }
            else {
                res.status(500).json({ error: 'Failed to load data' });
            }
        }
    });
});

router.put('/updateBooks/:_id', verifyJWTtoken, async (req, res) => {

    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        console.log(authData);
        if (err) {
            res.status(200).json({ message: "Invalid token" });
        }
        else if (authData.value.role === "Admin" || authData.value.role === "Librarian") {
            console.log(req.params._id);
            let data = await categoriesModel.updateOne(
                { _id: req.params._id }, { $set: req.body },

            )
            console.log(data);

            if (data) {
                res.status(200).json({ message: "Updated SucessFully" });
            }
            else {
                res.status(400).json({ message: "Updation Failed" })
            }
        }
        else {
            res.status(501).json({ message: "Admin and Librarian only can Update." })
        }
    })

})

router.delete('/deleteBooks/:_id', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(200).json({ message: "Invalid Token" });
        }
        else if (authData.value.role === 'Admin') {
            let books = await categoriesModel.deleteOne({ _id: req.params._id });
            if (books) {
                res.status(200).json({ message: "Deleted Record Successfully" });
            }
            else {
                res.status(501).json({ message: "Internal Server Error" });
            }
        }
        else {
            res.status(501).json({ message: 'Record can be Deleted by Admin only' });
        }
    })
})


router.delete('/deleteBooksincategory/:cname/:bname', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(200).json({ message: "Invalid Token" });
        }
        else if (authData.value.role === 'Admin') {
            console.log('Category Name:', req.params.cname);
            console.log('Book Title:', req.params.bname);

            // This code uses the $pull operator to remove the specific object from the books array within the document that matches the specified categoryname and has a title matching bookTitleToRemove.
            const result = await categoriesModel.updateOne(
                { categoryname: req.params.cname },
                { $pull: { books: { title: req.params.bname } } }
              );
            console.log(result);
            if (result) {
                res.status(200).json({ message: "Book deleted Successfully" });
                let updateIssueBook = await categoriesModel.updateOne(
                    { categoryname: req.params.cname },
                    { $inc: { currentBookCount: -1 , booksCount : -1} }
                );
                console.log(updateIssueBook);
            }
            else {
                res.status(501).json({ message: "Internal Server Error" });
            }
        }
        else {
            res.status(501).json({ message: 'Record can be Deleted by Admin only' });
        }
    })
})

router.post('/issueBooks/:_id/:categoryname/:bookname', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid token" });
        }
        else if (authData.role === 'Librarian') {
            issuebookArray=[]
            let studentId = await users.findOne({ _id: req.params._id });
            if (studentId) {
                let category = await categoriesModel.find({ categoryname: req.params.categoryname });
                issuebookArray.push(category);
                console.log(issuebookArray);
                if (category) {
                    let book = category.books.find(book => book.title === req.params.bookname);
                    let issueBooks = {
                        "librarianId": authData.id,
                        "studentId": studentId._id.toString(),
                        "categoryId": category._id.toString(),
                        "categoryName": category.categoryname,
                        "bookId": book._id.toString(),
                        "bookname": book.title
                    }
                    let addIssueBooks = new issueModel(issueBooks);


                    if (addIssueBooks) {
                        // let category = await categoriesModel.findOne({ categoryId : req.params.categoryname });
                        let updateIssueBook = await categoriesModel.updateOne(
                            { categoryId: category._id.toString() },
                            { $inc: { currentBookCount: -1 } }
                        );
                        if (updateIssueBook) {
                            let issuebook = await addIssueBooks.save();
                            console.log(issuebook);
                            res.status(200).json({ message: "Book is issued successfully" });
                            issuebookArray=[]
                        }

                    } else {
                        res.status(400).json({ message: "Failed to issue the book" });
                        issuebookArray=[]
                    }

                }
                else {
                    res.status(200).json({ message: "No books found" })
                    issuebookArray=[]
                }
            }
            else {
                res.status(400).json({ message: "invalid student details" });
                issuebookArray=[]
            }

        }
        else {
            res.status(200).json({ message: "Internal Server Error" });
            issuebookArray=[]
        }
    })
})


router.post('/returnBooks/:_id/:studentId/:bookId', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid token" });
        }
        let issuedId = await issueModel.findOne({ _id: req.params._id });
        console.log(issuedId);
        if (issuedId && issuedId.studentId === req.params.studentId && issuedId.bookId) {

            let returnBookData = {
                "librarianId": issuedId.librarianId,
                "studentId": issuedId.studentId,
                "categoryId": issuedId.categoryId,
                "categoryName": issuedId.categoryName,
                "bookId": req.params._id,
                "bookname": issuedId.bookname,
                "issueDate": issuedId.issueDate,
                "dueDate": issuedId.dueDate,
                "returnDate": new Date(),
                "numberOfDays": 0,
                "charges": 0
            }

            returnBookData.numberOfDays = Math.ceil((returnBookData.returnDate - returnBookData.issueDate) / (1000 * 60 * 60 * 24));
            // Calculate charges based on overdue days
            if (returnBookData.numberOfDays > 0) {
                const daysOverdue = returnBookData.numberOfDays;
                const perDayCharge = 5; // Set your per-day charge here
                // Calculate charges
                returnBookData.charges = daysOverdue * perDayCharge;
            }
            // If dueDate and returnDate are the same, set charges to zero
            if (returnBookData.dueDate.toDateString() === returnBookData.returnDate.toDateString()) {
                returnBookData.charges = 0;
            }
            console.log(returnBookData);
            let returnBook = new returnbookModel(returnBookData);
            if (returnBook) {
                // let category = await categoriesModel.findOne({ categoryname: issuedId.categoryName });
                let s = await categoriesModel.updateOne(
                    { _id: issuedId.categoryId },
                    { $inc: { currentBookCount: 1 } }
                );
                let deleteIssuedBook = await issueModel.deleteOne({ categoryId: issuedId.categoryId });
                if (s) {
                    let savereturnBook = await returnBook.save();
                    res.status(200).json({
                        message: "Book Returned Sucessfully",
                        sucess: "True",
                        charges: returnBookData.charges
                    })
                }

            }
            else {
                res.status(200).json({
                    message: "Internal Server Error"
                })
            }

        }
        else {
            res.status(200).json({
                message: "Issued Book Not found"
            })
        }
    })
})


router.post('/issueBooks/:_id', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid token" });
        }
        else if (authData.value.role === 'Librarian') {
            let studentId = await users.findOne({ _id: req.params._id });
            let checkIfBookAlreadyIssued = await mutlipleissueBooks.find({ studentId: req.params._id });
            if (studentId) {
                if (Array.isArray(req.body) && req.body) {
                    let books = req.body;

                    // Use Promise.all to wait for all asynchronous operations in the loop
                    let errors = [];
                    issuebookArray=[];
                    await Promise.all(
                        books.map(async element => {
                            if (element.categoryname === '' || element.categoryname === null) {
                                // res.status(400).json({ message: "Category Not Found" })
                                errors.push("Category Not Found");
                            }
                            else  {


                                let category = await categoriesModel.findOne({ categoryname: element.categoryname });
                                let issuedBooks = checkIfBookAlreadyIssued.map(issue => issue.books).flat();
                                let book = category.books.find(book => book.title.toLowerCase() === element.bookname.toLowerCase());
                                if (issuedBooks.some(issuedBook => issuedBook.bookname.toLowerCase() === element.bookname.toLowerCase()) && issuedBooks.some(issuedBook => issuedBook.categoryName.toLowerCase() === element.categoryname.toLowerCase()) && book.bookcount === 0) {
                                    //  res.status(400).json({ message: "Book already issued" });
                                    errors.push("Out of stock");
                                }
                                else if(issuedBooks.some(issuedBook => issuedBook.bookname.toLowerCase() === element.bookname.toLowerCase()) && issuedBooks.some(issuedBook => issuedBook.categoryName.toLowerCase() === element.categoryname.toLowerCase()) && checkIfBookAlreadyIssued.some(item => item.studentId === req.params._id)){
                                    errors.push("Already Same Book Issued For Same Student");
                                }
                                else{
                                    let book = category.books.find(book => book.title.toLowerCase() === element.bookname.toLowerCase());
                                    let bookdetails = {
                                        "categoryId": category._id.toString(),
                                        "categoryName": category.categoryname,
                                        "bookId": book._id.toString(),
                                        "bookname": book.title
                                    }
                                    issuebookArray.push(bookdetails);
                                    issueBooksPayload = {
                                        "librarianId": authData.value.id,
                                        "studentId": studentId._id.toString(),
                                        "books": issuebookArray
                                    }

                                }
                            }
                        })
                    );
                    if (errors.length > 0) {
                        return res.status(400).json({ errors });
                    }
                    if (issueBooksPayload) {
                        console.log(issueBooksPayload);
                        let addIssueBooks = new mutlipleissueBooks(issueBooksPayload);
                        if (addIssueBooks.books && addIssueBooks.books.length > 0) {
                            await Promise.all(
                                issueBooksPayload.books.map(async element => {

                               let category = await categoriesModel.findOne({ categoryname: element.categoryName });
                               let book = category.books.find(book => book.title.toLowerCase() === element.bookname.toLowerCase());
                                  console.log(book);
                                    if (element.categoryName != '' && book.bookcount > 0 ) {
                                        updateIssueBook = await categoriesModel.updateOne(
                                            { categoryname: element.categoryName, "books._id": element.bookId },
                                            { $inc: { currentBookCount: -1,"books.$.bookcount": -1 } }
                                        )
                                        console.log(updateIssueBook);
                                    }

                                })

                            );

                        }
                    
                        if (addIssueBooks) {
                            let issuebook = await addIssueBooks.save();
                            // console.log(issuebook);
                            res.status(200).json({ message: "Book is issued successfully" });
                        }


                        else {
                            res.status(400).json({ message: "Failed to issue the book" });
                        }
                    }
                    else {
                        res.status(400).json({ message: "No books found" })
                    }

                }
                else {
                    res.status(400).json({ message: "Category name and book name should not be Empty" });
                }
            }
            else {
                res.status(400).json({ message: "invalid student details" });
            }
        }

        else {
            res.status(200).json({ message: "Internal Server Error" });
        }
    })
})

router.post('/returnBooks/:_id/:studentId', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid token" });
        }
        let issuedId = await mutlipleissueBooks.findOne({ _id: req.params._id });
        console.log(issuedId);
        if (issuedId && issuedId.studentId === req.params.studentId) {

            issuedId.books.map(element => {

                let issuedbooksofstdents = {
                    "categoryId": element.categoryId,
                    "categoryName": element.categoryName,
                    "bookId": element._id,
                    "bookname": element.bookname,
                }
                returnbooks.push(issuedbooksofstdents);
            })

            console.log(returnbooks);
            let returnBookData = {
                "librarianId": issuedId.librarianId,
                "studentId": issuedId.studentId,
                "books": returnbooks,
                "returnDate": new Date(),
                "issueDate": issuedId.issueDate,
                "dueDate": issuedId.dueDate,
                "numberOfDays": 0,
                "charges": 0
            }
            console.log(returnBookData);
            returnBookData.numberOfDays = Math.ceil((returnBookData.returnDate - returnBookData.issueDate) / (1000 * 60 * 60 * 24));
            // Calculate charges based on overdue days
            if (returnBookData.numberOfDays > 5) {
                const daysOverdue = returnBookData.numberOfDays;
                const perDayCharge = 5; // Set your per-day charge here
                // Calculate charges
                returnBookData.charges = daysOverdue * perDayCharge;
            }
            // If dueDate and returnDate are the same, set charges to zero
            if (returnBookData.dueDate.toDateString() === returnBookData.returnDate.toDateString()) {
                returnBookData.charges = 0;
            }
            console.log(returnBookData);
            let returnmutlibooks = new multireturnbookModel(returnBookData);
            if (returnmutlibooks) {
                // let category = await categoriesModel.findOne({ categoryname: issuedId.categoryName });
                await Promise.all(
                    returnBookData.books.map(async element => {
                        let s = await categoriesModel.updateOne(
                            { _id: element.categoryId },
                            { $inc: { currentBookCount: 1 } }
                        );
                        console.log(s);
                        let deleteIssuedBook = await multipleissueModel.deleteOne({ _id: req.params._id });
                        console.log(deleteIssuedBook);
                    })

                )

                if (returnbooks) {
                    let savereturnBook = await returnmutlibooks.save();
                    res.status(200).json({
                        message: "Book Returned Sucessfully",
                        sucess: "True",
                        charges: returnBookData.charges
                    })
                }

            }
            else {
                res.status(200).json({
                    message: "Internal Server Error"
                })
            }

        }
        else {
            res.status(200).json({
                message: "Issued Book Not found"
            })
        }
    })
})

router.post('/returnBooks/:studentId', verifyJWTtoken, async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid token" });
        }
        else {

            if (req.body != '' || req.body != null || req.body != undefined) {

                let returnbooksbyuser = req.body;
                if ( Array.isArray(req.body) && returnbooksbyuser) {
                    returnbooksbyuser.map(async book => {
                        if (book.issuedId != '' || book.categoryname != '' || book.bookname != '') {
                            let checkIssuedId = await mutlipleissueBooks.findOne({ _id: element.id });
                            console.log(checkIssuedId);
                            if (checkIssuedId) {
                                checkIssuedId.books.map(element => {
                                    if (element.categoryName === book.categoryname && element.bookname === book.bookname) {
                                        let issuedbooksofstdents = {
                                            "categoryId": element.categoryId,
                                            "categoryName": element.categoryName,
                                            "bookId": element.bookId,
                                            "bookname": element.bookname,
                                        }
                                        multireturnbooks.push(issuedbooksofstdents);
                                    }
                                })
                            }
                            else {
                                res.status(400).json({ message: "Book Issued Id not found" });
                            }
                        }
                        else {
                            res.status(400).json({ message: "BookName or CategoryName is Required" });
                        }
                    })

                }
            }
            else {
                res.status(400).json({ message: "Book IssuedId Required" });
            }
        }
    })
})



router.post('/returnBooksById/:studentId', verifyJWTtoken, async (req, res) => {
    multireturnbooks=[];
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
       if(err){
        res.status(400).json({message:"Invalid Token"});
       }
       else if(authData){
        let issuedbooks = await multipleissueModel.find({studentId:req.params.studentId});
        let books = req.body;
        if(issuedbooks && books && Array.isArray(req.body)){
            console.log(issuedbooks);
           issuedbooks.map(book => {
           book.books.map(element => {
            
            if( element != null && req.body.find(item => item.categoryname === element.categoryName && item.bookname === element.bookname))
            {
            let issuedbooksofstdents = {
                "librarianId": book.librarianId,
                "categoryId": element.categoryId,
                "categoryName": element.categoryName,
                "bookId": element._id,
                "bookname": element.bookname,
                "issuedate":book.issueDate,
                "duedate":book.dueDate
            }
            multireturnbooks.push(issuedbooksofstdents);
            }
           })
        })
    
        let totalCharges=0;
        let returnDate = new Date();
        let  numberOfDays = 0;
        if(multireturnbooks.length > 0){
           multireturnbooks.forEach(book =>{
              numberOfDays = Math.ceil((returnDate - book.duedate) / (1000 * 60 * 60 * 24));
            if (numberOfDays > 0) {
                const daysOverdue = numberOfDays;
                const perDayCharge = 5; // Set your per-day charge here
                totalCharges =  daysOverdue * perDayCharge;
            }
            // If dueDate and returnDate are the same, set charges to zero
            if (book.duedate.toDateString() === returnDate.toDateString()) {
                     totalCharges = 0;
            }
           })
        }
        let modelForReturnBooks={
            "studentId": req.params.studentId,
            "books": multireturnbooks,
            "returnDate": returnDate,
            "numberOfDays": numberOfDays,
            "charges": totalCharges
        }
        // if(modelForReturnBooks){
        //     let result = new multireturnbookModel(modelForReturnBooks);
        //     let returnbookarray = await result.save();
        //     let s = issuedbooks.map(async book => {
        //         book.books = book.books.filter(async element => {
        //             let updatebook = await categoriesModel.updateOne(
        //                 { categoryname: element.categoryName, "books._id": element.bookId },
        //                 { $inc: { currentBookCount: +1,"books.$.bookcount": +1 } }
        //             )
        //             if (books.find(item => item.categoryname === element.categoryName && item.bookname === element.bookname)) {
        //                 console.log(books.find(item => item.categoryname === element.categoryName && item.bookname === element.bookname));
        //                 return false; 
        //             } else {
        //                 return true;
        //             }
                    
        //         });
               
        //        if(book.books.length === 0){
        //             let deleterow = await mutlipleissueBooks.deleteOne({ _id : book._id.toString()});
        //             console.log(deleterow);
        //         }
        //         console.log(book._id.toString());
        //         let updated=await mutlipleissueBooks.updateOne({_id:book._id.toString()},{$set:{books:book.books}});
        //         console.log('Hi');
        //         console.log(book.books);
        //         console.log(updated);
        //     });
        
         
        //     if(returnbookarray){
        //         res.status(200).json({
        //             message:"Books Returned ScuessFully ..",
        //             charges:modelForReturnBooks.charges
        //         })
        //     }
        //     else{
        //         res.status(400).json({
        //             message:"Books Returned Failed"
        //         })
        //     }
        // }
        if (modelForReturnBooks) {
            try {
                let result = new multireturnbookModel(modelForReturnBooks);
                let returnbookarray = await result.save();
        
                // Loop through issuedbooks array
                for (let i = 0; i < issuedbooks.length; i++) {
                    let book = issuedbooks[i];
                     console.log(book);
                    
                    
                    book.books =await Promise.all(book.books.map(async element => {
                       
                        if (req.body.some(item => item.categoryname === element.categoryName && item.bookname === element.bookname)) {
                            // Condition to identify the book to delete
                            let updatebook = await categoriesModel.updateOne(
                                { categoryname: element.categoryName, "books._id": element.bookId },
                                { $inc: { currentBookCount: +1, "books.$.bookcount": +1 } }
                            );
                            return null; // Returning null will remove the book from the array
                        }
                        return element; // Keep the book if it doesn't meet the delete condition                
                    }));
                    book.books = book.books.filter(element => element !== null);
                  
                    if (book.books.length === 0) {
                        let deleterow = await mutlipleissueBooks.deleteOne({ _id : book._id.toString()});
                        console.log(deleterow);
                        console.log(book.books.length);
                    }
                    
                        // Update book.books array
                        let updated = await mutlipleissueBooks.updateOne({ _id: book._id.toString() }, { $set: { books: book.books } });
                      
                }
        
                // Respond based on returnbookarray value
                if (returnbookarray) {
                    res.status(200).json({
                        message: "Books Returned Successfully ..",
                        charges: modelForReturnBooks.charges
                    });
                } else {
                    res.status(400).json({
                        message: "Books Returned Failed"
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
        }
        
        }
        else{
            res.status(400).json({message:"Atleast Return One Book"});
        }
    }
        else{
            res.status(200).json({message:"No Books Issued on this ID"});
        }
       })
})


router.get('/getIssuedBooks/:_id',verifyJWTtoken,  async (req, res) => {
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid Token" });
        }
        else {
            
            const books = await mutlipleissueBooks.find({studentId:req.params._id});
            if (books) {
                res.status(200).json(books);
            } else {
                res.status(501).json({ message: "No Books Issued on this ID "});
            }
        }
    })
})

router.get('/issuedbooks/report/:type',verifyJWTtoken,async(req,res)=>{
    jwttoken.verify(req.token, secrectkey, async (err, authData) => {
        if (err) {
            res.status(400).json({ message: "Invalid Token" });
        }else if(req.params.type === 'Weekly'){
            let books = await multireturnbookModel.find();
            let returnDate = new Date();
            let weeklyBooks = books.filter(book => {
                return book.books.some(item => {
                    
                    let diff = returnDate - item.issuedate;
                    let daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
                     return daysDiff < 7 ;
                });
            });
          if(weeklyBooks){
              res.status(200).json({
                  message: weeklyBooks
              })
          }
          else{
            res.status(501).json({message:'Internal Server Error'})
          }
        }
        else if(req.params.type === 'For 15 days'){
            let books = await multireturnbookModel.find();
            let returnDate = new Date();
            let weeklyBooks = books.filter(book => {
                return book.books.some(item => {
                    
                    let diff = returnDate - item.issuedate;
                    let daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
                     return daysDiff < 15;
                });
            });
            if(weeklyBooks){
                res.status(200).json({
                    message: weeklyBooks
                })
            }
            else{
              res.status(501).json({message:'Internal Server Error'})
            }
        }
        else if(req.params.type === 'Monthly'){
            let books = await multireturnbookModel.find();
            let returnDate = new Date();
            let weeklyBooks = books.filter(book => {
                return book.books.some(item => {
                    
                    let diff = returnDate - item.issuedate;
                    let daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
                     return daysDiff < 30 ;
                });
            });
            if(weeklyBooks){
                res.status(200).json({
                    message: weeklyBooks
                })
            }
            else{
              res.status(501).json({message:'Internal Server Error'})
            }
        }
     })    
})





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

module.exports = router;