const express = require("express");
const router = express.Router();
const HelpCtrl = require("./controllers/helpController");

router.post("/addHelp", HelpCtrl.addHelp);

module.exports = router;