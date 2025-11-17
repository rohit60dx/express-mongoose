import express from 'express'
import cors from 'cors'


const app = express();
app.use(cors())
app.get('/', (req, resp)=>{

resp.send({
    'name':"Rohit",
    'age': 30,
    'email':"Test@gmail.com"
}) 
})


app.listen(8080)