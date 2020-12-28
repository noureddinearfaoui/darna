const mongoose = require("mongoose");
const DocLinkSchema = mongoose.Schema(
  {
    description: { type: String, required: true},
    url: { type: String},
    type:{type: String, required: true},
  },
  { timestamps: true }
);
module.exports = mongoose.model("DocLink", DocLinkSchema);
 

