const express = require("express");
const router = express.Router();
const demandeCtrl = require("./controller/demandeParticipationController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.get(
  "/addDemande/:idUser/:idAction",
  auth,
  permit("membre"),
  demandeCtrl.addDemande
);
router.put(
  "/updateStatus/:idP",
  auth,
  permit("admin"),
  demandeCtrl.updateStatus
);
router.put(
  "/updateParticipation/:idP",
  auth,
  permit("admin", "membre"),
  demandeCtrl.updateParticipation
);

router.get(
  "/participationRequestByMember/:userId",
  auth,
  permit("admin", "membre"),
  demandeCtrl.getParticipationDemandesByMember
);
router.get(
  "/requestsByAction/:idAction",
  auth,
  permit("admin"),
  demandeCtrl.getDemandesByAction
);
router.get(
  "/requestForActionByMember/:idUser/:idAction",
  auth,
  permit("admin", "membre"),
  demandeCtrl.getDemandesByMemberAndAction
);
router.get(
  "/numberOfAcceptedDemandes/:idAction",
  auth,
  permit("admin", "membre"),
  demandeCtrl.getAcceptedDemandesByAction
);
module.exports = router;
