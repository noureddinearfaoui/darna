
const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true},
    price: { type: String, required: true },
    picture: { type: String},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);

