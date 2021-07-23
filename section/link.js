const mongoose = require("mongoose");
  const LinkSchema = new mongoose.Schema({
      description : String,
      url : String
  });
  
  module.exports= mongoose.model('Link', LinkSchema);  