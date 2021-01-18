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
router.get(
  "/notifyAll/:id",
  NotifCtrl.addNotificationActionToAllUser
);

router.get(
  "/getNotificationsUser/:id",
  NotifCtrl.getNotificationToAUser
);
router.get(
  "/getNotificationsAdmin",
  NotifCtrl.getNotificationAdmin
);

router.get(
  "/updateSeen/:idNotif",
  auth,
  permit("admin", "membre"),
  NotifCtrl.updateSeen
);
router.get(
  "/seenNotification/:id",
  auth,
  permit("admin", "membre"),
  NotifCtrl.updateSeenForAllNotificateUser
);

router.delete(
  "/deleteNotification/:idNotif",
  auth,
  permit("admin", "membre"),
  NotifCtrl.deleteNotification
);

module.exports = router;
