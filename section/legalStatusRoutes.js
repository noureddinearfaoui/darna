const express = require("express");
const router = express.Router();
const LegalStatusCtrl = require(".//controllers/legalStatusController");

router.post("/addLegalStatus",LegalStatusCtrl.addLegalStatus);
router.get("/getAllLegalStatus", LegalStatusCtrl.getAllLegalStatus);
router.get("/getLegalStatusDetails/:id",LegalStatusCtrl.getLegalStatusDetails);
router.put("/updateLegalStatus/:id",LegalStatusCtrl.updateLegalStatus);
router.delete("/deleteLegalStatus/:id",LegalStatusCtrl.deleteLegalStatus);
router.get("/app/files/:nomFile", LegalStatusCtrl.getFileByNom);


module.exports = router;
