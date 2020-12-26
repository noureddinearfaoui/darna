const express = require("express");
const router = express.Router();
const HelpCtrl = require("./controllers/helpController");

router.post("/addHelp", HelpCtrl.addHelp);
router.get("/app/images/:nomImage", HelpCtrl.getImageByNom);

module.exports = router;