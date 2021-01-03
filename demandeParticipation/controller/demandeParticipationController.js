const DemandeParticipation = require("../model/demandeParticipation");
const User = require("../../user/model/user");
const Action = require("../../action/model/action");
exports.addDemande = (req, res, next) => {
  let idUser = req.params.idUser;

  let idAction = req.params.idAction;
  User.findById(idUser).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 })
    .then((user) => {
      Action.findById(idAction).select({ _id:1, actionName: 1, description: 1, location:1,beginDate:1, endDate:1,beginDateInscription:1,endDateInscription:1,
        numberOfMembers:1,isPublished:1 })
        .then((action) => {
          const demande = new DemandeParticipation({
            member: user,
            action: action,
          });
          DemandeParticipation.findOne({action:idAction,member:idUser})
          .then((existdemande)=>{
        if(existdemande){
          return res.status(404).send({
            message: "Demande existe déjà",
          });
        }  
        else{ 
          demande
            .save()
            .then(
              () => {
                demande.member = demande.member._id;
                demande.action = demande.action._id;
                res.status(200).json(demande);
            })
            .catch((error) =>
              res.status(500).json({ message: "error server" + error })
            );
          }
             })
            .catch((error) =>
            res.status(404).json({ message: "demande Non trouvé" })
          );
        })
        .catch((error) =>
          res.status(404).json({ message: "action Non trouvé" })
        );
    })
    .catch((error) => res.status(404).json({ message: "user Non trouvé" }));
};

//update status
exports.updateStatus = (req, res) => {
  DemandeParticipation.findByIdAndUpdate(
    req.params.idP,
    {
      status: req.body.status,
    },
    { new: true }
  )
    .then((demande) => {
      if (!demande) {
        return res.status(404).send({
          message: "Demande not found",
        });
      }
      res.status(201).send({
        message: "Status updated",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Demande not found",
        });
      }
      return res.status(500).send({
        message: "Error update status",
      });
    });
};

//update participation
exports.updateParticipation = (req, res) => {
  DemandeParticipation.findByIdAndUpdate(
    req.params.idP,
    {
      participated: req.body.participated,
    },
    { new: true }
  )
    .then((demande) => {
      if (!demande) {
        return res.status(404).send({
          message: "Demande not found",
        });
      }
      res.status(201).send({
        message: "Participation updated",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Demande not found",
        });
      }
      return res.status(500).send({
        message: "Error update Participation",
      });
    });
};
///////////////////////////Demandes par membre
exports.getParticipationDemandesByMember = (req, res) => {
  let userId = req.params.userId;

  DemandeParticipation.find({ member: userId })
    .then((demande) => {
      res.status(200).json(demande);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found",
        });
      }
      return res.status(500).send({
        message: "Server error",
      });
    });
};
////////Demandes pour une action donnée
exports.getDemandesByAction = (req, res) => {
  let id = req.params.idAction;

  DemandeParticipation.find({ action: id })
    .then((demande) => {
      res.status(200).json(demande);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      return res.status(500).send({
        message: "Server error",
      });
    });
};

////////Demande pour une action donnée et un membre donné
exports.getDemandesByMemberAndAction = (req, res) => {
  let idA = req.params.idAction;
  let idM = req.params.idUser;

  DemandeParticipation.findOne({ action: idA, member: idM })
    .then((demande) => {
      res.status(200).json(demande);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "wrong ObjectId Form",
        });
      }
      return res.status(500).send({
        message: "Server error",
      });
    });
};

//
exports.getAcceptedDemandesByAction = (req, res) => {
  let idA = req.params.idAction;
  DemandeParticipation.count({ status: "acceptée", action: idA })
    .then((demandes) => {
      res.status(200).json(demandes);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "wrong ObjectId Form",
        });
      }
      return res.status(500).send({
        message: "Server error",
      });
    });
};
