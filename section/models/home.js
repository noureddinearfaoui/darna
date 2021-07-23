const mongoose = require("mongoose");
const HomeSchema = mongoose.Schema(
  {
    presentation:{ type: String },
    donation:{type: String},
    goals: { type: Array},
    announcements: { type: Array},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", HomeSchema);


