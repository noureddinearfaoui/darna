const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const ActionSchema = mongoose.Schema(
  {
    NomAction: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    lieu: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date },
    dateDebutIndcription: { type: Date, required: true },
    dateFinIndcription: { type: Date, required: true },
    nbrMembres: { type: Number, required: true },
    estPublie: { type: Boolean, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
  },
  { timestamps: true }
);
ActionSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Action", ActionSchema);
