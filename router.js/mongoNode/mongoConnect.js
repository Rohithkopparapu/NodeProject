const {MongoClient} = require('mongodb');
const url ='mongodb://localhost:27017';
const client =new MongoClient(url);

async function dbConnection()
{
    let result = await client.connect();
    let db= result.db('Products');
     return db.collection('NodeProducts');
  
}

module.exports = dbConnection;