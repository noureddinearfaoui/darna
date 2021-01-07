const mongoose = require("mongoose");
const NotificationSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    lien: { type: String, required: true },
    description: { type: String, required: true },
    lien:{ type: String, required: true },
    typeNotification: { type: String, required: true },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    seenDetails: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Notification", NotificationSchema);
