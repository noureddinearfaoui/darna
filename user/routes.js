const express = require("express");
const router = express.Router();

const UserCtrl = require("./controller/userController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");

router.post("/signin", UserCtrl.login);
router.post("/signup", UserCtrl.signup);
router.post("/add", auth, permit("admin"), UserCtrl.add);
router.get("/confirm/:id", UserCtrl.confirmAccount);
router.get("/confirme/:id", UserCtrl.confirmAccount);
router.get("/details/:id", UserCtrl.getUserDetails);
router.put("/details/:id", UserCtrl.updateUserDetails);
module.exports = router;
