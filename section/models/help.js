const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Link = new Schema({
  description : String,
  url : String
});

const HelpSchema = mongoose.Schema(
  {
    question: { type: String, required: true},
    answers :  [Link],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Help", HelpSchema);
