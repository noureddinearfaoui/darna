const express = require("express");
const router = express.Router();
const UserCtrl = require("./controller/userController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/signin", UserCtrl.login);
router.post("/signup", UserCtrl.signup);
router.get("/test", auth, permit("membre"), UserCtrl.test);
router.get("/confirm/:id", UserCtrl.confirmAccount);
router.get("/details/:id", UserCtrl.getUserDetails);
router.put("/details/:id", UserCtrl.updateUserDetails);
router.get("/allUsers", UserCtrl.getAllUsers);
router.get("/AcceptedMembers", UserCtrl.getAcceptedMembers);
router.get("/Demandes", UserCtrl.getDemandes);
router.post("/addMember", UserCtrl.addMember);
router.post("/addNewAdhesion/:id", UserCtrl.NouveauAdhsion);
router.get("/adhesionUser", UserCtrl.adhsionUser);
router.put("/banni/:id", UserCtrl.banniMember);
router.put("/accepted/:id", UserCtrl.acceptMember);
router.delete("/deleteMember/:id", UserCtrl.deleteOneMember);
router.get("/UserByEmail/:email", UserCtrl.getUserByEmail);

module.exports = router;
