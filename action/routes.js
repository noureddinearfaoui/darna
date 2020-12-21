const express = require("express");
const router = express.Router();
const ActionCtrl = require("./controller/actionController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addAction", auth, permit("admin"), ActionCtrl.addAction);
router.get("/allActions", ActionCtrl.getAllActions);
router.get(
  "/action/:id",
  auth,
  permit("admin", "membre"),
  ActionCtrl.getActionDetails
);
router.put(
  "/updateAction",
  auth,
  permit("admin"),
  ActionCtrl.updateActionDetails
);
router.put(
  "/publishAction/:id",
  auth,
  permit("membre", "admin"),
  ActionCtrl.publishAction
);
router.delete(
  "/deleteAction/:id",
  auth,
  permit("admin"),
  ActionCtrl.deleteOneAction
);

router.get(
  "/actionDetailsWithoutPhoto/:id",
  auth,
  permit("membre", "admin"),
  ActionCtrl.getActionWithoutPhoto
);


module.exports = router;
