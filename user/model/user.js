const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  LastName: { type: String, required: true },
  urlImage: { type: String, required: true },
  adress: { type: String, required: true },
  tel: { type: String, required: true },
  DateOfBirth: { type:Date , required: true },
  
  roles : [
    {type: mongoose.Schema.Types.ObjectId,ref:'Role'}
]
   },
   { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);