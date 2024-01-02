const connection = require('./mongoConnect.js');

const insertData = async () => {
    let db = await connection();
    const result = await db.insertMany(
       [ { firstname: 'Venakt', lastName: 'Rachipudi', email: 'venkat@gmail.com', age: 24, gender: 'M' },
          {firstname: 'Akash', lastName: 'N', email: 'N@gmail.com', age: 26, gender: 'M' }
       ]
    );
 if(result.acknowledged){
    console.log('data inserted');
 }
}

insertData();