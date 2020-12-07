const User = require("../../user/model/user");
const Notification = require("../../notification/model/notification");

exports.addNotification = (req, res, next) => {
  let idUser = req.body.receiver;

  User.findById(idUser)
    .then((user) => {
      const notification = new Notification({
        date: req.body.date,
        description: req.body.description,
        receiver: user,
      });
      notification
        .save()
        .then(() => {
          notification.receiver = notification.receiver._id;
          res.status(200).json(notification);
        })
        .catch((error) =>
          res.status(500).json({ message: "error server" + error })
        );
    })
    .catch((error) => res.status(404).json({ message: "Membre non trouvé" }));
};

exports.getNotification = (req, res) => {
  Notification.findById(req.params.idNotif)
    .then((notification) => {
      res.status(200).json(notification);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "ObjectId incompatible",
        });
      }
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};

exports.getAllNotifications = (req, res) => {
  Notification.find()
    .sort({ date: 1 })
    .then((notifications) => {
      res.status(200).json(notifications);
    })
    .catch((error) =>
      res.status(400).json({ message: "Pas de notifications" })
    );
};

exports.updateSeen = (req, res) => {
  Notification.findByIdAndUpdate(
    req.params.idNotif,
    {
      seen: true,
    },
    { new: true }
  )
    .then((notification) => {
      if (!notification) {
        return res.status(404).send({
          message: "Pas de notification",
        });
      }
      res.status(200).send({
        message: "Notification vue",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Notification non trouvée",
        });
      }
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};

exports.deleteNotification = (req, res) => {
  Notification.findByIdAndRemove(req.params.idNotif)
    .then((notification) => {
      if (!notification) {
        return res.status(404).send({
          message: "Notification non trouvée",
        });
      }
      res.status(200).send({ message: "Notification supprimée" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Notification non trouvée",
        });
      }
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};
