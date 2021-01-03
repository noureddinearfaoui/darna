const Sponsor = require("../models/sponsor");
const dir = "uploads/sponsors";
require("dotenv").config();
const manageFiles = require("../../config/manageFiles");
exports.addSponsor = (req, res, next) => {
    const sponsor = new Sponsor({
        linkSponsor: req.body.linkSponsor,
        });
        sponsor
          .save()
          .then((s) => {
            if (req.body.linkPicture) {
              let linkPicture=manageFiles.createFile(dir,req.body.linkPicture,s._id,
                "/api/sponsor/app/images/");
              s.linkPicture=linkPicture;
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

exports.updateSponsor = (req, res) => {
    const idSponsor = req.params.id;
    Sponsor.findById(idSponsor)
    .then((sponsor) => {
      if(req.body.linkSponsor){
        sponsor.linkSponsor = req.body.linkSponsor;
      }
      if(req.body.linkPicture){
        let linkPicture=manageFiles.createFile(dir,req.body.linkPicture,sponsor._id,
          "/api/sponsor/app/images/");
        sponsor.linkPicture=linkPicture;
      } 
        sponsor.save().then((resultat)=>{
          res.status(200).json(resultat);
        }).catch((error) =>
          res.status(500).json({ message: error })
        );
          
    })
    .catch((error) =>
      res.status(404).json({ message: "Sponsor non trouvé" }) 
    );
  };

exports.deleteSponsor = (req, res) => {
    const idSponsor = req.params.id;
      Sponsor.findById(idSponsor)
        .then((sponsor) => {
          sponsor
            .remove()
            .then(() =>{ 
              manageFiles.deleteFile(dir,idSponsor);
              res.status(200).json({message:"sponsor supprimé avec succès"});
            })
            .catch((error) =>
              res.status(500).json({ message: "Erreur serveur" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Sponsor non trouvé" })
        );
  };

exports.getAllSponsors = (req, res, next) => {
    Sponsor.find()
      .then((sponsors) => {
        res.status(200).json(sponsors);
      })
      .catch((error) => res.status(404).json({ message: "Erreur pendant la récupération des sponsors" }));
  };


exports.getSponsorDetails = (req, res) => {
    Sponsor.findById(req.params.id)
      .then((sponsor) => {
        res.send(sponsor);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Sponsor non trouvé",
          });
        }
        return res.status(500).send({
          message: "Erreur serveur",
        });
      });
  };

exports.getImageByNom = (req, res) => {
  let urlImage=manageFiles.getFileByNom(dir,req.params.nomImage);
  if (!urlImage) {
    return res.status(404).json({ message: "Image n'existe pas!!" });
  }
  return res.sendFile(urlImage);
};