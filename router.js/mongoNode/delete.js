const connection = require('./mongoConnect.js');

const deletData = async () => {

    let data = await connection();
    const result= await data.deleteOne(
        {email:'kumar@gmail.com'}
);
   if(result.acknowledged){
    console.log('deleted sucessFully');
   }
}
deletData();