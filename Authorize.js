const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Products');
var filterArray;;
const db = mongoose.Schema({
    firstname: String,
    password: Number
})
const model = mongoose.model('NodeProducts', db, 'NodeProducts');
const authorize = async (req, res, next) => {
    filterArray = [];
    //checking For Authorization based uon given a user value in query params.
    let result = await model.find();
    const { user, password } = req.query;
    const filteredResult = result.filter(item => item.firstname === user && item.password === parseInt(password));
    console.log(filteredResult);
    if (filteredResult.length > 0) {
        filterArray.push(...filteredResult);
        next();
    }
    else {

        res.status(401).json('UnAuthorized');

    }

}


module.exports = { authorize, filterArray };