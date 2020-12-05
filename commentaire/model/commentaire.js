const mongoose = require("mongoose");
const CommentaireSchema = mongoose.Schema(
  {
    date: { type: Date, required: true },
    typeMessage: { type: String, required: true },
    message: { type: String, required: true },
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
module.exports = mongoose.model("Commentaire", CommentaireSchema);
