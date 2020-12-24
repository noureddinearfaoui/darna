const mongoose = require("mongoose");
const HomeSchema = mongoose.Schema(
  {
    presentation: { type: String, required: true },
    donation:{type: String, required: true},
    goals: { type: Array, required: true },
    sponsors: { type: Array, required: true },
    announcements: { type: Array, required: true },
    

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", HomeSchema);


