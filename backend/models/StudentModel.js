const mongoose = require('mongoose')

 const StudentSchema = new mongoose.Schema({
    name:String,
    userName:String,
    password:String
 })

 const StudentModel = mongoose.model("student", StudentSchema)
 
 module.exports = StudentModel