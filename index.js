const express = require('express');
const app=express();

const appFile = require('./app');
const dataFromDB=appFile;

app.use(express.json())

app.get('/' , (req,res)=>{
    res.send('Hi Kopparapu');
})

app.get('/api/courses',(req,res)=>{
    res.send(dataFromDB);
})

app.get('/api/courses/:id' , (req,res)=>{
   let obj=dataFromDB.find((data)=>{
      return  data.id === parseInt(req.params.id);
    })
  if(obj){
        res.send(obj);
        res.end();
    }
    else{
      res.status(404).send('No data found')
    }
})

app.post('/api/course',(req,res)=>{

    if(req.body.title === '' || req.body.title.length < 3 || req.body.title === null){
        res.status(404).send('Title should match Certain conditions');
    }else{
        const course = {
            userId:'1',
            id:dataFromDB.length+1,
            "title":req.body.title,
            "body":req.body.body
        }
        dataFromDB.push(course);
        res.send(course);
    }
})


app.put('/api/course/:id',(req,res)=>{
    let obj=dataFromDB.find((data)=>{
        return  data.id === parseInt(req.params.id);
      })
    if(obj){
         obj.title=req.body.title;
         res.send(obj);
      }
})

app.delete('/api/course/:id',(req,res)=>{
    let obj=dataFromDB.find((data)=>{
        return  data.id === parseInt(req.params.id);
      })
    const index=dataFromDB.indexOf(obj);
    dataFromDB.splice(index,1);
    res.send(dataFromDB);
})

const port = process.env.port || 8000;
app.listen(port,console.log(`Listening to port of ${port}...`));