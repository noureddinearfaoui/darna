const mongoose = require("mongoose");
const NotificationSchema = mongoose.Schema(
  {
    date: { type: Date, default: new Date() },
    description: { type: String, required: true },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Notification", NotificationSchema);
