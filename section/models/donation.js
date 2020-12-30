const mongoose = require("mongoose");
const DonationSchema = mongoose.Schema(
  {
    urlDonation: { type: String, required: true},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Donation", DonationSchema);
