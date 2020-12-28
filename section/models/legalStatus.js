const mongoose = require("mongoose");
const LegalStatusSchema = mongoose.Schema(
  {
    description: { type: String, required: true},
    url: { type: String},
  },
  { timestamps: true }
);
module.exports = mongoose.model("LegalStatus", LegalStatusSchema);
 

