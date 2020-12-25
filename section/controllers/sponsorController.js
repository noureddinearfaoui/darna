const Sponsor = require("../models/sponsor");
const fs = require("fs");
const directory = require("../../pathDirectory");
const dirUploads = "uploads";
const dir = "uploads/sponsors";
require("dotenv").config();

exports.addSponsor = (req, res, next) => {
    const sponsor = new Sponsor({
        linkSponsor: req.body.linkSponsor,
        });
        sponsor
          .save()
          .then((s) => {
            if (!fs.existsSync(dirUploads)) {
                fs.mkdirSync(dirUploads);
            }
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            if (req.body.linkPicture) {
              let data = req.body.linkPicture;
              let buff = Buffer.from(data.split(";base64,")[1], "base64");
              let extension = data.split(";base64,")[0].split("/")[1];
              let fileName = dir + "/" + s._id + "." + extension;
              fs.writeFileSync(fileName, buff);
              linkPicture =`${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +"/api/sponsor/app/images/" +s._id + "." + extension;
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
        if (!fs.existsSync(dirUploads)) {
          fs.mkdirSync(dirUploads);
        }
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        let files = fs.readdirSync(dir);
        if (files.find((el) => el.indexOf(sponsor._id) !== -1)) {
          let fileT = files.find((el) => el.indexOf(sponsor._id) !== -1);
          fs.unlinkSync(dir + "/" + fileT, () => {});
        }
        let data = req.body.linkPicture;
        let buff = Buffer.from(data.split(";base64,")[1], "base64");
        let extension = data.split(";base64,")[0].split("/")[1];
        let fileName = dir + "/" + sponsor._id + "." + extension;
        fs.writeFileSync(fileName, buff);
        linkPicture =`${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +"/api/sponsor/app/images/" +sponsor._id + "." + extension;
        sponsor.linkPicture=linkPicture;
        sponsor.save().then((resultat)=>{
          res.status(200).json(resultat);
        }).catch((error) =>
          res.status(500).json({ message: error })
        );
      }else{
        res.status(200).json(sponsor);
      }      
    })
    .catch((error) =>
      res.status(404).json({ message: "Sponsor non trouvé" })
    );
  };

exports.deleteSponsor = (req, res) => {
    const idSponsor = req.params.id;
      Sponsor.findById(idSponsor)
        .then((sponsor) => {
          if(fs.existsSync(dir)){
            let files = fs.readdirSync(dir);
            if (files.find((el) => el.indexOf(sponsor._id) !== -1)) {
              let fileT = files.find((el) => el.indexOf(sponsor._id) !== -1);
              fs.unlinkSync(dir + "/" + fileT, () => {});
            }
          }
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

exports.getImageByNom = (req, res) => {
  let nomImage = req.params.nomImage;
  let files = fs.readdirSync(dir);
  if (!files.includes(nomImage)) {
    return res.status(404).json({ message: "Image n'existe pas!!" });
  }
  return res.sendFile(directory + "/" + dir + "/" + nomImage);
};