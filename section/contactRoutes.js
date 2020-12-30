const express = require("express");
const router = express.Router();
const ContactCtrl = require("./controllers/contactController");

router.post("/manageContact", ContactCtrl.manageContact);
router.get("/getContact", ContactCtrl.getContact);
module.exports = router;