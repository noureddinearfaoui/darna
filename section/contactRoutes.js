const express = require("express");
const router = express.Router();
const ContactCtrl = require("./controllers/contactController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/manageContact", auth, permit("admin"), ContactCtrl.manageContact);
router.get("/getContact", ContactCtrl.getContact);
module.exports = router;