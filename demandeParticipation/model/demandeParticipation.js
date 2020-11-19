const mongoose = require("mongoose");
const DemandeParticipationSchema = mongoose.Schema(
  {
    etat: { type: String, required: true},
    participate: { type: Boolean, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      action: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action"
      }

  },
  { timestamps: true }
);
module.exports = mongoose.model("DemandeParticipation", DemandeParticipationSchema);
