const Sponsor = require("../models/sponsor");
const fs = require("fs");
const directory = require("../../pathDirectory");
const dir = "sponsors";
require("dotenv").config();

exports.addSponsor = (req, res, next) => {
    const sponsor = new Sponsor({
        linkSponsor: req.body.linkSponsor,
        });
        sponsor
          .save()
          .then(() => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
              }
              let files = fs.readdirSync(dir);
              let tableOfId = [];
              files.forEach((element) => {
                tableOfId.push(element.split(".")[0]);
              });
              if (req.body.linkPicture) {
                let data = req.body.linkPicture;
                let buff = Buffer.from(data.split(";base64,")[1], "base64");
                let extension = data.split(";base64,")[0].split("/")[1];
                let fileName = dir + "/" + sponsor._id + "." + extension;
                fs.writeFileSync(fileName, buff);
              }
    
          })
          .catch((error) =>
            res.status(500).json({ message: "error server" + error })
          );
     
  };

exports.updateSponsor = (req, res) => {
    const idSponsor = req.params.id;
      Sponsor.findById(idSponsor)
        .then((sponsor) => {
            if(req.body.newlinkSponsor){
          sponsor.linkSponsor = req.body.newlinkSponsor;
        }
          sponsor.linkPicture = req.body.newlinkPicture;
          sponsor
          .save()
          .then(() =>{ 
            if (fs.existsSync(dir)) {
                let files = fs.readdirSync(dir);
                if (files.find((el) => el.indexOf(sponsor._id) !== -1)) {
                  let fileT = files.find((el) => el.indexOf(sponsor._id) !== -1);
                  fs.unlinkSync(dir + "/" + fileT, () => {});
                }
              }
              let linkPicture = "";
          if (req.body.newlinkSponsor) {
            let buff = Buffer.from(sponsor.linkPicture.split(";base64,")[1], "base64");
            let extension = sponsor.linkPicture.split(";base64,")[0].split("/")[1];
            let fileName = dir + "/" + sponsor._id + "." + extension;
            fs.writeFileSync(fileName, buff);
            let file = user._id + "." + extension;
            linkPicture =
              `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +
              "/api/sponsor/app/sponsors/" +
              file;
          }
          res.status(200).json({message:"Sponsor modifié avec succès"}) 
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