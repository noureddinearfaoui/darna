
const mongoose = require("mongoose");
const ProjectSchema = mongoose.Schema(
  {
    projectDescription: { type: String, required: true},
    projectStatus: { type: String, required: true },
   
  },
  { timestamps: true }
);
module.exports = mongoose.model("Project", ProjectSchema);



