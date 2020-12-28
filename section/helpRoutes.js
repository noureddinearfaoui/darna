const express = require("express");
const router = express.Router();
const HelpCtrl = require("./controllers/helpController");

router.post("/addHelp", HelpCtrl.addHelp);
router.get("/app/files/:nomFile", HelpCtrl.getFileByNom);
router.get("/getAllHelps", HelpCtrl.getAllHelps);
router.get("/getHelpDetails/:id",HelpCtrl.getHelpDetails);
router.delete("/deleteHelp/:id",HelpCtrl.deleteHelp);
router.put("/updateQuestion/:id",HelpCtrl.updateQuestion);
router.delete("/deleteAnswerByIdHelpAndIdAnswer/:id/:idAnswer",HelpCtrl.deleteAnswerByIdHelpAndIdAnswer);
router.put("/addAnswerByIdHelp/:id", HelpCtrl.addAnswerByIdHelp);
router.put("/updateAnswerByIdHelpAndIdAnswer/:id/:idAnswer",HelpCtrl.updateAnswerByIdHelpAndIdAnswer);


module.exports = router;