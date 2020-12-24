const mongoose = require("mongoose");
const HelpSchema = mongoose.Schema(
  {
    question: { type: String, required: true},
    answer :  {type: Array, required: true},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Help", HelpSchema);
