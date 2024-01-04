const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Products');
const productsSchema = new mongoose.Schema({
    firstname:String,
    lastName:String,
    email:String,
    age:Number,
    gender:String,
    location:String
})
const main = async () => {
    // const ProductsModel = mongoose.model("NodeProducts",productsSchema,"NodeProducts");

    // let data = new ProductsModel({firstname:'123',lastName:"789",email:'12@gmail.com',age:23,gender:'M',location:'XYZ'});
    // let result = await data.save();
  
}

const updateDB = async () =>{
     const ProductsModel = mongoose.model("NodeProducts",productsSchema,"NodeProducts");
     let data = await ProductsModel.updateOne({email:'venkat@gmail.com'},{$set:{firstname:'Harin'}});
     console.log(data);
}

const deleteDB = async () => {
    const ProductsModel = mongoose.model("NodeProducts",productsSchema,"NodeProducts");
    let data = await ProductsModel.deleteOne({email:'12@gmail.com'});
    console.log(data);
}

main();
updateDB();
deleteDB();

//productsModel.find for get All recors if specific recors find({condition})