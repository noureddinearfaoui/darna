const express = require("express");
const router = express.Router();
const HomeCtrl = require("./controllers/homeController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/manageHome", auth, permit("admin"), HomeCtrl.manageHome);
router.get("/getHome", HomeCtrl.getHome);


module.exports = router;






