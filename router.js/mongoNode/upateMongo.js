const connection = require('./mongoConnect.js');

const updateData = async () => {

    let data = await connection();
    const result= await data.updateOne(
        {email:'kumar@gmail.com'},{$set:{lastName:'K'}},
        // {email:'vijay@gmail.com'},{$set:{lastName:'Marisetti'}}
);
   if(result.acknowledged){
    console.log('Updated sucessFully');
   }
}
updateData();