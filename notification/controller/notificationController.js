const User = require("../../user/model/user");
const Notification = require("../../notification/model/notification");
const Action = require("../../action/model/action");

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
exports.addNotificationActionToAllUser = (req, res, next) => {
  //console.log(req.params)
  let idAction = req.params.id;
  //console.log(idAction)

  Action.findById(idAction)
    . select({__id:1,beginDate:1})
    .then((action) => {
      
    //  res.json(action)
     /* const notification = new Notification({
        title:"Nouvelle Action ",
        Date: new Date(),
        description: `Chèrs membres on vous informe que tarna va lancer une action qui va démarrer le ${action.beginDate} pour plus de détails consulter le site`,
      });*/
        User.find({role : {$ne :'admin'}})
        . select({__id:1,email:1})
      .then(users=>{
        let notification=null;
        users.forEach(user=>
          {
             notification = new Notification({
              title:"Nouvelle Action ",
              Date: new Date(),
              description: `Chèrs membres on vous informe que tarna va lancer une action qui va démarrer le ${action.beginDate} pour plus de détails consulter le site`,
              receiver:user
            });
            
            //console.log(notification)
            notification
            .save()
            .then(() => {
            })
            .catch((error) =>
              res.status(500).json({ message: "error server" + error })
            );

          })
          delete  notification.receiver;

          res.status(200).json(notification);

       })
      .catch((error) => res.status(404).json({ message: "Membre non trouvé" }));
    
    })
    .catch((error) => res.status(404).json({ message: "action non trouvé" }));
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
exports.getNotificationToAUser = (req, res) => {
 let idUser= req.params.id ; 
  Notification.find({receiver:idUser})
    .then((notifications) => {
      
      res.status(200).json(notifications);
    })
    .catch((err) => {
     
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};

exports.getAllNotifications = (req, res) => {
  //console.log("hi")
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
