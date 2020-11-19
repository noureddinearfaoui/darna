const express = require("express");
const router = express.Router();
const ActionCtrl = require("./controller/actionController");
router.get("/addAction",ActionCtrl.addAction);

module.exports = router;