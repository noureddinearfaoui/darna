const User = require("../../user/model/user");
const Notification = require("../../notification/model/notification");
const Action = require("../../action/model/action");
const DemandeParticipation = require("../../demandeParticipation/model/demandeParticipation");

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
  let idAction = req.params.id;
  Action.findById(idAction)
    . select({__id:1,beginDate:1,actionName:1})
    .then((action) => {
      
        User.find({role : {$ne :'admin'}})
        . select({__id:1,email:1})
      .then(users=>{
        let notification=null;
        users.forEach(user=>
          {
             notification = new Notification({
              title:"Nouvelle Action ",
              date: new Date(),
              description: `Chers membres on vous informe que Darna va lancer une action <strong>${action.actionName}</strong> qui va démarrer le <strong> ${formatDate(action.beginDate)} </strong>.<br> Pour plus de détails cliquez ici`,
              lien:`accueil/details-action/${action._id}`,
              idAction:action._id,
              receiver:user,
              typeNotification:'m'
            });
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
  .sort({date:-1})
    .then((notifications) => {
      res.status(200).json(notifications);
    })
    .catch((err) => {
     
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};
exports.getNotificationAdmin = (req, res) => {
  
 
   Notification.find({typeNotification:'a'})
   .sort({date:-1})
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
  Notification.find()
    .sort({date:-1 })
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
      seenDetails: true,
    }
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
exports.updateSeenForAllNotificateUser = (req, res) => {
 
  Notification.updateMany({receiver: req.params.id}, {"$set":{seen: true}})
    .then((notification) => {
      res.status(200).send({ message: "suceess" });
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
}
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
exports.personNotRenwal  = () => {
  console.log("personrenw")
  let date = new Date(); 
  let datTemp ;
  let bol ;
  let nbOfPersonne =0;
  User.find({role : {$ne :'admin'},accepted :true,confirm:true})
      . select({__id:1,renewal:1})
      .then(users=>{
        users.forEach(user=>{
           bol =false;
           user.renewal.forEach(dateRenewal=>{
             datTemp = new Date(dateRenewal)
             if(datTemp.getFullYear()==date.getFullYear())
              bol=true;
           })
           if(!bol)
            {nbOfPersonne++;
            
              let notification = new Notification({
                title:`Renouvellement `,
                date: new Date(),
                description: `Vous devez contacter l'admin pour renouveller votre abonnement`,
                lien:'not',
                receiver:user,
                typeNotification:'m'
              });
              notification
                  .save()
                  .then(() => {
                  })
                  .catch((error) =>
                    console.log(error)
                  );
            }
        })
        if(nbOfPersonne>0)
        {
        User.findOne({role : 'admin'})
            . select({__id:1,firstName:1})
            .then(admin=>{
       
        let notification = new Notification({
          title:`Renouvellement`,
          date: new Date(),
          description: `Vous devez renouveller l'abonnement de <strong>${nbOfPersonne} membres<strong>.`,
          lien:'gerer-membres/list',
          receiver:admin,
          typeNotification:'a'
        });
        notification
            .save()
            .then(() => {
            })
            .catch((error) =>
              console.log(error)
            );
          })
          .catch((error)=> console.log(error));
          }
      })
      .catch((error)=> console.log(error));
}

exports.nearbyEvents  = () => {
   let date = new Date(); 
   let dateaux;
  Action.find({endDateInscription : {$gte :date},beginDateInscription : {$lte :date}})
  . select({__id:1,numberOfMembers:1,endDateInscription:1,actionName:1})
  .then((data)=>{        
     data.forEach((el)=>{
      dateaux=new Date(el.endDateInscription);
      if(dateaux.getTime()-date.getTime()<604800000)
      {
      DemandeParticipation.find({action:el._id})
      .populate()
      .then((reslt)=>{
        if(el.numberOfMembers>reslt.length)
        {
        User.findOne({role : 'admin'})
            . select({__id:1,firstName:1})
            .then(user=>{
                      let notification = new Notification({
                      title:"Le nombre de participants est manquant",
                      date: new Date(),
                     description: `Il y a encore des places vides dans l'action ${el.actionName}`,
                     lien:`gerer-actions/details-action/${el._id}`,
                     idAction:el._id,
                     receiver:user,
                     typeNotification:'a'
                     });
                         notification
                         .save()
                         .then(() => {
                         })
                        .catch((error) =>
                       console.log(error)
                       );
             })
             .catch((error) =>
                       console.log(error)
                       );
           }
              
      })
    }
     })
  })
}
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = ''+ d.getFullYear(),
      hour=''+d.getUTCHours(),
      minute=''+d.getUTCMinutes();

  if (month.length < 2) 
  {
    month = '0' + month;
  }
  if (day.length < 2) 
  {
    day = '0' + day;
  }
  if(hour.length<2){
    hour='0'+hour;
  }
  if(minute.length<2){
    minute='0'+minute;
  }
  let newFormat=[day, month,year ].join('-')+" "+hour+":"+minute;
  return newFormat;
}