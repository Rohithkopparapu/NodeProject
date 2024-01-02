const connection = require('./mongoConnect.js');

const getData = async () => {

    let data = await connection();
    data = await data.find({}).toArray();
 return data;
}

module.exports = getData;

