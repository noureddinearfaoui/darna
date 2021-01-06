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
  //console.log(req.params)
  let idAction = req.params.id;
  //console.log(idAction)

  Action.findById(idAction)
    . select({__id:1,beginDate:1,actionName:1})
    .then((action) => {
      
    //  res.json(action)
     /* const notification = new Notification({
        title:"Nouvelle Action ",
        Date: new Date(),
        description: `Chèrs membres on vous informe que tarna va lancer une action qui va démarrer prochainement pour plus de détails consulter le site`,
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
              description: `Chèrs membres on vous informe que tarna va lancer une action ${action.actionName} qui va démarrer le ${action.beginDate} pour plus de détails consulter le site`,
              lien:`accueil/details-action/${action._id}`,
              receiver:user,
              typeNotification:'m'
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
exports.getNotificationAdmin = (req, res) => {
  
 
   Notification.find({typeNotification:'a'})
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
  //console.log("personrenw")
  let date = new Date(); 
  let datTemp ;
  let bol ;
  let nbOfPersonne =0;
  User.find({role : {$ne :'admin'}})
      . select({__id:1,renewal:1})
      .then(users=>{
       
       // console.log(date.getFullYear());
        users.forEach(user=>{
           //console.log(user.renewal)
           bol =false;

           user.renewal.forEach(dateRenewal=>{
             datTemp = new Date(dateRenewal)
             //console.log(datTemp.getFullYear())
             if(datTemp.getFullYear()==date.getFullYear())
              bol=true;
           })
           if(bol)
            {nbOfPersonne++;
            
              notification = new Notification({
                title:`Renouvellement `,
                Date: new Date(),
                description: `vous devez renouveller votre abonnement`,
                lien:'gerermembres/list',
                receiver:user,
                typeNotification:'m'
              });
              //console.log(user)
              
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
       
        notification = new Notification({
          title:`Renouvellement `,
          Date: new Date(),
          description: `${nbOfPersonne} qui n'ont pas renouveller leur abonnement`,
          lien:'gerer-membres/list',
          receiver:admin,
          typeNotification:'a'
        });
       // console.log(admin)
        
        notification
            .save()
            .then(() => {
            })
            .catch((error) =>
              console.log(error)
            );
            //console.log(nbOfPersonne)
           
          })
          .catch((error)=> console.log(error));
          }
        
      
      })
      .catch((error)=> console.log(error));
}

exports.nearbyEvents  = () => {
 
   let date = new Date(); 
  // console.log('ner')

  Action.find({beginDate : {$gt :date}})
  . select({__id:1,numberOfMembers:1,beginDate:1,actionName:1})
  .then((data)=>{
   // console.log(data)
        
     data.forEach((el)=>{
      //console.log(el)
    
      DemandeParticipation.find({action:el._id})
      .populate()
      .then((reslt)=>{
       // console.log(el.numberOfMembers)
        //console.log(reslt.length)
        if(el.numberOfMembers>reslt.length)
        {//console.log("notifier")
        User.findOne({role : 'admin'})
            . select({__id:1,firstName:1})
            .then(user=>{
                      notification = new Notification({
                      title:"Le nombre de membre est manquant ",
                      Date: new Date(),
                     description: `il y a encore des places vides pour l'evenement ${el.actionName}`,
                     lien:"gerer-actions/list",
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
     })
   //es.status(200).send(data);

  })

  /*DemandeParticipation.find({action:'5fbbeedb1762261da0e11990'})
  .populate()
  .then((data)=>{
    res.status(200).send(data);

  })*/


}
