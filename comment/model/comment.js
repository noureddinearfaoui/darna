const mongoose = require("mongoose");
const CommentSchema = mongoose.Schema(
  {
    date: { type: Date, default: new Date() },
    typeMessage: { type: String, required: true, default: "text" },
    message: { type: String },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Action",
    },
    nameOfSender: { type: String, required: true },
    urlImageOfSender: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", CommentSchema);
