// const jwttoken= require('jsonwebtoken');
// const categoriesModel=require('./categores.js');
const express = require('express');
const app = express();
// const secrectkey="secrectkey";

const catController=require("./logicController.js");
const cors = require('cors');

app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use('/catController',catController);
// 
//  
  app.listen(8000, console.log('Listening port 8000'));
