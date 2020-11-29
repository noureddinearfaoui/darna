const mongoose = require("mongoose");

const resettokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  resetToken: { type: String, required: true },
  resetPasswordExpires: { type: Date, required: true },
});

module.exports = mongoose.model("passwordResetToken", resettokenSchema);
