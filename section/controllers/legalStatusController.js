const LegalStatus = require("../models/legalStatus");
const dirUploads = "uploads";
const dir = "uploads/legalStatus";
require("dotenv").config();
const manageFiles = require("../../config/manageFiles");

exports.addLegalStatus = (req, res, next) => {
    const legalStatus = new LegalStatus({
        description: req.body.description,
        });
        legalStatus
          .save()
          .then((s) => {
            if (req.body.url) {
              let linkFile=manageFiles.createFile(dirUploads,dir,req.body.url,s._id,
                `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}`,
                "/api/legalStatus/app/files/");
              s.url=linkFile;
              s.save().then((resultat)=>{
                res.status(200).json(resultat);
              }).catch((error) =>
                res.status(500).json({ message: error })
              );
            }else {
              res.status(200).json(s);
            }
          })
          .catch((error) =>
            res.status(500).json({ message: error })
          );
     
  };

exports.updateLegalStatus = (req, res) => {
    const idLs = req.params.id;
    LegalStatus.findById(idLs)
    .then((ls) => {
      if(req.body.description){
        ls.description = req.body.description;
      }
      if(req.body.url){
        let linkFile=manageFiles.createFile(dirUploads,dir,req.body.url,ls._id,
          `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}`,
          "/api/legalStatus/app/files/");
        ls.url=linkFile;
      } 
        ls.save().then((resultat)=>{
          res.status(200).json(resultat);
        }).catch((error) =>
          res.status(500).json({ message: error })
        );
          
    })
    .catch((error) =>
      res.status(404).json({ message: "Statut juridique non trouvé" }) 
    );
  };

exports.deleteLegalStatus = (req, res) => {
    const idLs = req.params.id;
      LegalStatus.findById(idLs)
        .then((ls) => {
            ls
            .remove()
            .then(() =>{ 
              manageFiles.deleteFile(dir,idLs);
              res.status(200).json({message:"Statut juridique supprimé avec succès"});
            })
            .catch((error) =>
              res.status(500).json({ message: "Erreur serveur" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Statut juridique non trouvé" })
        );
  };

exports.getAllLegalStatus = (req, res, next) => {
    LegalStatus.find()
      .then((ls) => {
        res.status(200).json(ls);
      })
      .catch((error) => res.status(404).json({ message: "Erreur pendant la récupération des statuts juridiques" }));
  };


exports.getLegalStatusDetails = (req, res) => {
    LegalStatus.findById(req.params.id)
      .then((ls) => {
        res.send(ls);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Statut juridique non trouvé",
          });
        }
        return res.status(500).send({
          message: "Erreur serveur",
        });
      });
  };

exports.getFileByNom = (req, res) => {
  let urlFile=manageFiles.getFileByNom(dir,req.params.nomFile);
  if (!urlFile) {
    return res.status(404).json({ message: "Fichier n'existe pas!!" });
  }
  return res.sendFile(urlFile);
};