const express = require("express");
const router = express.Router();
const HelpCtrl = require("./controllers/helpController");

router.post("/addHelp", HelpCtrl.addHelp);
router.get("/app/images/:nomImage", HelpCtrl.getImageByNom);
router.get("/getAllHelps", HelpCtrl.getAllHelps);
router.get("/getHelpDetails/:id",HelpCtrl.getHelpDetails);
router.delete("/deleteHelp/:id",HelpCtrl.deleteHelp);
router.put("/updateHelp/:id",HelpCtrl.updateHelp);
router.delete("/deleteAnswerByIdHelpAndIdAnswer/:id/:idAnswer",HelpCtrl.deleteAnswerByIdHelpAndIdAnswer);

module.exports = router;