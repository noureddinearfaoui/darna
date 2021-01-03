const mongoose = require("mongoose");
const SponsorSchema = mongoose.Schema(
  {
    linkSponsor: { type: String, required: true},
    linkPicture: { type: String},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Sponsor", SponsorSchema);
 

