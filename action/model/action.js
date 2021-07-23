const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const ActionSchema = mongoose.Schema(
  {
    actionName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    beginDate: { type: Date, required: true },
    endDate: { type: Date },
    beginDateInscription: { type: Date, required: true },
    endDateInscription: { type: Date, required: true },
    numberOfMembers: { type: Number, required: true },
    isPublished: { type: Boolean, required: true },
    urlPhoto: { type: String },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
  },
  { timestamps: true }
);
ActionSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Action", ActionSchema);
