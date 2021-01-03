const mongoose = require("mongoose");
const StudySchema = mongoose.Schema(
  {
    description: { type: String, required: true},
    url: { type: String},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Study", StudySchema);
 

