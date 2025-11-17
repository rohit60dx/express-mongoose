import mongoose from 'mongoose';

async function connectToDatabase()  {
  const uri = 'mongodb://localhost:27017/collage';
await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

    const schema = new mongoose.Schema({
      name: String,
      age: Number,
      email: String
    });

    const studentsModel = mongoose.model('students', schema);
const result = await studentsModel.find();
console.log(result);

}

connectToDatabase();