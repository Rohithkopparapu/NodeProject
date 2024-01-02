const logger = (req,res,next) => {
const body = req.method;
const url = req.url;
const date = new Date().getFullYear();
console.log(body,url,date);
next()
}

module.exports = logger;