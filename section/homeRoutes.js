const express = require("express");
const router = express.Router();
const HomeCtrl = require("./controllers/homeController");

router.post("/manageHome", HomeCtrl.manageHome);



module.exports = router;






