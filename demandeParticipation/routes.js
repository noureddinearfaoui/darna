const express = require("express");
const router = express.Router();
const demandeCtrl = require("./controller/demandeParticipationController");
router.get("/addDemande/:idUser/:idAction",demandeCtrl.addDemande);

module.exports = router;