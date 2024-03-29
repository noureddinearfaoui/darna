const mongoose = require("mongoose");
const DemandeParticipationSchema = mongoose.Schema(
  {
    status: { type: String, required: true, default: "attente" },
    participated: { type: Boolean, required: true, default: "false" },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Action",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "DemandeParticipation",
  DemandeParticipationSchema
);
