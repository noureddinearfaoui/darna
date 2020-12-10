const express = require("express");
const router = express.Router();
const UserCtrl = require("./controller/userController");
const resetPassCtrl = require("./controller/passwordResetTokenController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/signin", UserCtrl.login);
router.post("/signup", UserCtrl.signup);
router.get("/test", auth, permit("membre"), UserCtrl.test);
router.get("/confirm/:id", UserCtrl.confirmAccount);
router.get(
  "/details/:id",
  auth,
  permit("admin"),
  UserCtrl.getUserDetails
);
router.put("/details/:id", auth, permit("admin"), UserCtrl.updateUserDetails);
router.get("/allUsers", auth, permit("admin"), UserCtrl.getAllUsers);
router.get(
  "/AcceptedMembers",
  auth,
  permit("admin"),
  UserCtrl.getAcceptedMembers
);
router.get("/Demandes", auth, permit("admin"), UserCtrl.getDemandes);
router.post("/addMember", auth, permit("admin"), UserCtrl.addMember);
router.post(
  "/addNewAdhesion/:id",
  auth,
  permit("admin"),
  UserCtrl.NouveauAdhsion
);
router.get("/adhesionUser", auth, permit("admin"), UserCtrl.adhsionUser);
router.put("/banni/:id", auth, permit("admin"), UserCtrl.banniMember);
router.put("/accepted/:id", auth, permit("admin"), UserCtrl.acceptMember);
router.delete(
  "/deleteMember/:id",
  auth,
  permit("admin"),
  UserCtrl.deleteOneMember
);
router.get("/UserByEmail/:email", UserCtrl.getUserByEmail);
router.post("/forgotPassword", resetPassCtrl.forgotPassword);
router.post("/resetPassword/:token", resetPassCtrl.resetPassword);
router.get("/getToken/:token", resetPassCtrl.getToken);

router.get("/getAllImagesLinksOfUsers", UserCtrl.getAllImagesLinksOfUsers);

router.get("/app/images/:nomImage", UserCtrl.getImageByNom);
router.put("/updateConnectedUser/:id", auth, UserCtrl.updateConnectedUser);
router.put("/updatePassword/:id", auth, UserCtrl.updatePassword);
router.get("/getConnectedUserdetails/:id",auth,UserCtrl.getConnectedUserdetails);
router.put("/updateConnectedUserImage/:id", auth, UserCtrl.updateConnectedUserImage);


module.exports = router;
