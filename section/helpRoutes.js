const express = require("express");
const router = express.Router();
const HelpCtrl = require("./controllers/helpController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addHelp", auth, permit("admin"), HelpCtrl.addHelp);
router.get("/app/files/:nomFile", HelpCtrl.getFileByNom);
router.get("/getAllHelps", HelpCtrl.getAllHelps);
router.get("/getHelpDetails/:id", auth, permit("admin"),HelpCtrl.getHelpDetails);
router.delete("/deleteHelp/:id", auth, permit("admin"),HelpCtrl.deleteHelp);
router.put("/updateQuestion/:id", auth, permit("admin"),HelpCtrl.updateQuestion);
router.delete("/deleteAnswerByIdHelpAndIdAnswer/:id/:idAnswer", auth, permit("admin"),HelpCtrl.deleteAnswerByIdHelpAndIdAnswer);
router.put("/addAnswerByIdHelp/:id", auth, permit("admin"), HelpCtrl.addAnswerByIdHelp);
router.put("/updateAnswerByIdHelpAndIdAnswer/:id/:idAnswer", auth, permit("admin"),HelpCtrl.updateAnswerByIdHelpAndIdAnswer);


module.exports = router;