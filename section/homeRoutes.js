const express = require("express");
const router = express.Router();
const HomeCtrl = require("./controllers/homeController");

router.post("/manageHome", HomeCtrl.manageHome);
router.get("/getHome", HomeCtrl.getHome);


module.exports = router;






