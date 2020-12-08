const express = require("express");
const router = express.Router();
const NotifCtrl = require("./controller/notificationController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post(
  "/addNotification",
  auth,
  permit("admin", "membre"),
  NotifCtrl.addNotification
);

router.get(
  "/getNotification/:idNotif",
  auth,
  permit("admin", "membre"),
  NotifCtrl.getNotification
);

router.get(
  "/getAllNotifications",
  auth,
  permit("admin", "membre"),
  NotifCtrl.getAllNotifications
);

router.put(
  "/updateSeen/:idNotif",
  auth,
  permit("admin", "membre"),
  NotifCtrl.updateSeen
);

router.delete(
  "/deleteNotification/:idNotif",
  auth,
  permit("admin", "membre"),
  NotifCtrl.deleteNotification
);

module.exports = router;
