import mongoose from 'mongoose';
import express from 'express'
import studentModel from './model/studentModel.js';


const app = express()



app.use(express.json());

const uri = 'mongodb://localhost:27017/collage';
await mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });



//GET: Get Data from db using mongoose
app.get("/", async (req, resp) => {
    const studentData = await studentModel.find();
    resp.send(studentData);

})


//POST: Save Data in monoogse 
app.post('/save', async (req, resp) => {
    console.log(req.body)
    const { name, age, email } = req.body;
    if (!req.body || !name || !age || !email) {
        return resp.status(400).json({
            status: 400,
            message: "All Fields are required"
        }); return false;
    }
    const studentData = await studentModel.create(req.body);
    resp.send({ status: resp.statusCode, message: "This is api response", savedInfo: studentData });
})


app.put("/update/:id", async (req, resp) => {

    const id = req.params.id;

    console.log(req.body, id);

    const studentData = await studentModel.findByIdAndUpdate(id, {
        ...req.body
    })
    resp.send({ status: resp.statusCode, message: "This is api response", updatedInfo: studentData });


})



app.delete("/delete/:id", async (req, resp) => {
    const id = req.params.id;
    console.log(req.body, id);
    const studentData = await studentModel.findByIdAndDelete(id, {
        ...req.body
    })
    resp.send({ status: resp.statusCode, message: "record deleted successfully", updatedInfo: studentData });
})


app.listen(8080)

// async function connectToDatabase()  {
//   const uri = 'mongodb://localhost:27017/collage';
// await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//       console.log('Connected to MongoDB successfully');
//     })
//     .catch((err) => {
//       console.error('Error connecting to MongoDB:', err);
//     });

//     const schema = new mongoose.Schema({
//       name: String,
//       age: Number,
//       email: String
//     });

//     const studentsModel = mongoose.model('students', schema);
// const result = await studentsModel.find();
// console.log(result);

// }

// connectToDatabase();