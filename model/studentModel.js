import mongoose from 'mongoose'
import studentSchema from '../schema/studentSchema.js'


const studentModel = mongoose.model('students', studentSchema)

export default studentModel;