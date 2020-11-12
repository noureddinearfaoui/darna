const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  urlImage: { type: String},
  adress: { type: String, required: true },
  tel: { type: String, required: true },
  dateOfBirth: { type:Date , required: true },
  confirm: { type:Boolean , required: true },
  banni: { type:Boolean , required: true },
  accepted: { type:Boolean , required: true },
  renewal: { type:Boolean , required: true },
  
  role : {type:String,required:true,default:"membre" }

   },
   { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);