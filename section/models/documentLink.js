const mongoose = require("mongoose");
//const Link = require ("../../section/link");

const DocumentLinkSchema = mongoose.Schema(
  {
    studies :    {type: Array ,  required: true},
    childRights :  {type: Array ,  required: true},
    partnerships :  {type: Array ,  required: true},
  },
  { timestamps: true }
);
module.exports = mongoose.model("DocumentLink", DocumentLinkSchema);


