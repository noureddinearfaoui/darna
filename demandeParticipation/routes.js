const express = require("express");
const router = express.Router();
const demandeCtrl = require("./controller/demandeParticipationController");
router.get("/addDemande/:idUser/:idAction", demandeCtrl.addDemande);
router.put("/updateStatus/:idP", demandeCtrl.updateStatus);
router.put("/updateParticipation/:idP", demandeCtrl.updateParticipation);
router.get(
  "/participationRequestByMember/:userId",
  demandeCtrl.getParticipationDemandesByMember
);
router.get("/requestsByAction/:idAction", demandeCtrl.getDemandesByAction);
router.get(
  "/requestForActionByMember/:idUser/:idAction",
  demandeCtrl.getDemandesByMemberAndAction
);
router.get(
  "/numberOfAcceptedDemandes/:idAction",
  demandeCtrl.getAcceptedDemandesByAction
);
module.exports = router;
