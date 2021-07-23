const Action = require("../model/action");
const User = require("../../user/model/user");
const DemandeParticipation = require("../../demandeParticipation/model/demandeParticipation");
const Notification=require("../../notification/model/notification")
const dir = "uploads/actions";
const manageFiles = require("../../config/manageFiles");
const Comment=require("../../comment/model/comment");
require("dotenv").config();

exports.addAction = (req, res, next) => {
  let idUser = req.headers.iduser;
  if (req.body.beginDate > req.body.endDate) {
    return res
      .status(400)
      .json({ message: "Date de début doit être inférieur à la date de fin" });
  }

  if (req.body.beginDateInscription > req.body.endDateInscription) {
    return res.status(400).json({
      message:
        "Date de début de l'inscription doit être inférieur à la date de fin de l'inscription",
    });
  }
  User.findById(idUser).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 })
    .then((user) => {
      if (user) {
       
        const action = new Action({
          ...req.body,
        });
        action.isPublished = false;
        action.admin = user;    
        action
          .save()
          .then((a) => {
            if(req.body.urlPhoto){ 
            if (req.body.urlPhoto.indexOf("base64")!==-1) {
              let urlPhoto=manageFiles.createFile(dir,req.body.urlPhoto,a._id,
                "/api/action/app/images/");
              a.urlPhoto=urlPhoto;}
              else{
                a.urlPhoto=req.body.urlPhoto;
              }
              }
              a.save().then((resultat)=>{
                res.status(200).json(resultat);
              })
              .catch((error) =>
                res.status(500).json({ message: error })
              );
          })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
      } else res.status(404).json({ message: "Utilisateur non trouvé " });
    })

    .catch((error) => res.status(404).json({ message: "Utilisateur non trouvé" }));
};
// Update Action Details
exports.updateActionDetails = (req, res) => {
  if (req.body.beginDate > req.body.endDate) {
    return  res.status(400).json({ message: "Date de début doit être inférieur à la date de fin" });
  }
  if (req.body.beginDateInscription > req.body.endDateInscription) {
    return res.status(400).json({
      message:
        "Date de début de l'inscription doit être inférieur à la date de fin de l'inscription",
    });
  }
  Action.findById(req.headers.id)
  .then((action) => {
    if(req.body.actionName){
      action.actionName = req.body.actionName;
    }
    if(req.body.description){
      action.description = req.body.description;
    }
    if(req.body.location){
      action.location = req.body.location;
    }
    if(req.body.beginDate){
      action.beginDate = req.body.beginDate;
    }
    if(req.body.endDate){
      action.endDate = req.body.endDate;
    }
    if(req.body.beginDateInscription){
      action.beginDateInscription = req.body.beginDateInscription;
    }
    if(req.body.endDateInscription){
      action.endDateInscription = req.body.endDateInscription;
    }
    if(req.body.numberOfMembers){
      action.numberOfMembers = req.body.numberOfMembers;
    }
    if(req.body.isPublished){
      action.isPublished = req.body.isPublished;
    }
    if(req.body.urlPhoto){ 
    if (req.body.urlPhoto.indexOf("base64")!==-1) {
      let urlPhoto=manageFiles.createFile(dir,req.body.urlPhoto,action._id,
        "/api/action/app/images/");
      action.urlPhoto=urlPhoto;}
      else{
        action.urlPhoto=req.body.urlPhoto;
      }
    }
    action.save().then((resultat)=>{
        res.status(200).json(resultat);
      }).catch((error) =>
        res.status(500).json({ message: error })
      );
      
  })
  .catch((error) =>
    res.status(404).json({ message: "Action non trouvé" })
  );
};


// delete action by id
exports.deleteOneAction = (req, res) => {
  DemandeParticipation.remove({ action: req.params.id }).then(() => {
    const idAction=req.params.id;
    Action.findById(idAction)
      .then((action) => {
        action
          .remove()
          .then(() =>{ 
            manageFiles.deleteFile(dir,idAction);
            Notification.find({idAction:idAction})
            .then((notifs)=>{
              notifs.forEach((el)=>{
              el.remove();
              });
            })
            .catch((error)=>{
            console.log(error);
            });
            Comment.find({action:idAction})
            .then((cmts)=>{
              cmts.forEach((el)=>{
                manageFiles.deleteFile("uploads/comments",el.message.split("/")[el.message.split("/").length-1]);
                el.remove();
              });
            })
            .catch((error)=>{
            console.log(error);
            });
            res.status(200).json({message:"Action supprimée avec succès"});
          })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
      })
      .catch((error) =>
        res.status(404).json({ message: "Action non trouvée" })
      );     
  })
  .catch((error) =>
        res.status(500).json({ message: "Erreur serveur" + error })
      );

};

// Find a single action
exports.getActionDetails = (req, res) => {
  Action.findById(req.params.id)
    .then((action) => {
      res.send(action);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action non trouvée",
        });
      }
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};

// Publish action
exports.publishAction = (req, res) => {
  Action.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    { new: true }
  )
    .then((action) => {
      if (!action) {
        return res.status(404).send({
          message: "Action non trouvée",
        });
      }
      res.status(201).send({
        message: "Action publiée",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action non trouvée",
        });
      }
      return res.status(500).send({
        message: "Ereur pendant la publication de l'action",
      });
    });
};
exports.getAllActions = (req, res, next) => {
  Action.find()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => res.status(404).json({ message: "Erreur pendant la récupération des actions" }));
};
exports.getImageByNom = (req, res) => {
  let urlImage=manageFiles.getFileByNom(dir,req.params.nomImage);
  if (!urlImage) {
    return res.status(404).json({ message: "Image n'existe pas!!" });
  }
  return res.sendFile(urlImage);
};

exports.getActionWithoutPhoto = (req, res) => {
  Action.findById(req.params.id).select({ actionName: 1, description: 1, location:1,beginDate:1, endDate:1,beginDateInscription:1,endDateInscription:1,
    numberOfMembers:1,isPublished:1 })
    .then((action) => {
      if (!action) {
        return res.status(404).send({
          message: "Action non trouvée",
        });
      }
      res.send(action);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action non trouvée",
        });
      }
      return res.status(500).send({
        message: "Erreur",
      });
    });
};

exports.getAllPublishedActions = (req, res, next) => {
  Action.find({ isPublished: true})
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => res.status(404).json({ message: "Erreur pendant la récupération des actions publiées" }));
};
