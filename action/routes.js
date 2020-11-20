const express = require("express");
const router = express.Router();
const ActionCtrl = require("./controller/actionController");
router.post("/addAction",ActionCtrl.addAction);
router.get("/allActions",ActionCtrl.getAllActions);

module.exports = router;