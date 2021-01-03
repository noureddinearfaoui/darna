const express = require("express");
const router = express.Router();
const MessageCtrl=require("./controllers/messageController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addMessage",MessageCtrl.addMessage);
router.get("/getAllMessages", auth, permit("admin"), MessageCtrl.getAllMessages);
router.get("/getMessageDetails/:id", auth, permit("admin"),MessageCtrl.getMessageDetails);
router.delete("/deleteMessage/:id", auth, permit("admin"),MessageCtrl.deleteMessage);

module.exports=router;