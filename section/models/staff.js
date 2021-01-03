const mongoose = require("mongoose");
const StaffSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true},
    role: { type: String, required: true },
    email: { type: String, required: true},
   
  },
  { timestamps: true }
);
module.exports = mongoose.model("Staff", StaffSchema);

