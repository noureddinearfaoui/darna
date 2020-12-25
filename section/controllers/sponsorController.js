const Sponsor = require("../models/sponsor");
//const fs = require("fs");
//const directory = require("../../pathDirectory");
//const dir = "sponsors";
//require("dotenv").config();

exports.addSponsor = (req, res, next) => {
    const sponsor = new Sponsor({
        linkSponsor: req.body.linkSponsor,
        linkPicture: req.body.linkPicture,
        });
        sponsor
          .save()
          .then(() => {
            res.status(200).json(sponsor);
          })
          .catch((error) =>
            res.status(500).json({ message: "error server" + error })
          );
     
  };

exports.updateSponsor = (req, res) => {
    const idSponsor = req.params.id;
      Sponsor.findById(idSponsor)
        .then((sponsor) => {
          sponsor.linkSponsor = req.body.linkSponsor;
          if(req.body.linkPicture){
            sponsor.linkPicture = req.body.linkPicture;
          }
          sponsor
            .save()
            .then(() =>{ 
            res.status(200).json({message:"sponsor modifié avec succès"});
             })
            .catch((error) =>
              res.status(500).json({ message: "Erreur serveur" + error })
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