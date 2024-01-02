const authorize  = (req,res,next) => {
//checking For Authorization based uon given a user value in query params.
    const {user} = req.query;
    if(user === 'Rohith'){
        console.log('user : '+ user);
        next();
    }
    else{
      
        res.status(401).json('UnAuthorized');
     
    }

}
module.exports = authorize;