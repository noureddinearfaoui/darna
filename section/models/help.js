const mongoose = require("mongoose");
const HelpSchema = mongoose.Schema(
  {
    question: { type: String, required: true},
    answers :  {type: Array, required: true},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Help", HelpSchema);
