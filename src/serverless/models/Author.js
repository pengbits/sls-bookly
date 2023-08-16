import mongoose from 'mongoose'

const AuthorSchema = new mongoose.Schema({
  name      : {type: String, required: [true]},
  vendorId  : {type: String, required: [true]},
  about     : String
})

const AuthorModel = mongoose.model('Author', AuthorSchema)
export default AuthorModel