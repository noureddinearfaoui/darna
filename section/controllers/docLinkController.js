const DocLink = require("../models/docLink");
const dir = "uploads/documents";
require("dotenv").config();
const manageFiles = require("../../config/manageFiles");

exports.addDocLink = (req, res, next) => {
  if(req.body.type && (req.body.type!=="droit"||req.body.type!=="statut-juridique"||req.body.type!=="étude"||req.body.type!=="partenaire")){
    return  res.status(400).json({ message: "Type incorrecte"});
    }
  if(!req.body.url ){
    return  res.status(400).json({ message: "Vous devez ajouter l'url"});
  }
  if(!req.body.description ){
    return  res.status(400).json({ message: "Vous devez ajouter la description"});
  }
    const docLink = new DocLink({
        description: req.body.description,
        type: req.body.type,
        });
        docLink
          .save() 
          .then((dl) => {
              if(req.body.type ==="partenaire"){
                dl.url=req.body.url;
              }
              else if(req.body.type==="droit"||req.body.type==="statut-juridique"||req.body.type==="étude"){
                let linkFile=manageFiles.createFile(dir,req.body.url,dl._id,
                  "/api/documents/app/files/");
                  dl.url=linkFile;
              }
              else{
              return  res.status(400).json({ message: "type incorrecte"})
              }
                dl.save().then((resultat)=>{
                res.status(200).json(resultat);
              }).catch((error) =>
                res.status(500).json({ message: error })
              
              );
          })
          .catch((error) =>
            res.status(500).json({ message: error })
          );    
  };

exports.updateDocLink = (req, res) => {
    const idDl = req.params.id;
    if(req.body.type && (req.body.type!=="droit"||req.body.type!=="statut-juridique"||req.body.type!=="étude"||req.body.type!=="partenaire")){
    return  res.status(400).json({ message: "Type incorrecte"});
    }
    if(!req.body.url ){
      return  res.status(400).json({ message: "Vous devez ajouter l'url"});
    }
    if(!req.body.description ){
     return res.status(400).json({ message: "Vous devez ajouter la description"});
    }
    DocLink.findById(idDl)
    .then((dl) => {
        dl.description = req.body.description;
        dl.type = req.body.type;
      
        if(req.body.type ==="partenaire"){
          dl.url=req.body.url;
        }
        else if(req.body.type==="droit"||req.body.type==="statut-juridique"||req.body.type==="étude"){
          let linkFile=manageFiles.createFile(dir,req.body.url,dl._id,
            "/api/documents/app/files/");
            dl.url=linkFile;
        }
        else{
        return  res.status(400).json({ message: "Type incorrecte"})
        }  
        dl.save().then((resultat)=>{
          res.status(200).json(resultat);
        }).catch((error) =>
          res.status(500).json({ message: error })
        );
          
    })
    .catch((error) =>
      res.status(404).json({ message: "Document non trouvé" }) 
    );
  };

exports.deleteDocLink = (req, res) => {
    const idDl = req.params.id;
      DocLink.findById(idDl)
        .then((dl) => {
          dl
            .remove()
            .then(() =>{ 
              manageFiles.deleteFile(dir,idDl);
              res.status(200).json({message:"Document supprimé avec succès"});
            })
            .catch((error) =>
              res.status(500).json({ message: "Erreur serveur" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Document non trouvé" })
        );
  };

exports.getAllDocsLinks = (req, res, next) => {
    DocLink.find()
      .then((dl) => {
        res.status(200).json(dl);
      })
      .catch((error) => res.status(404).json({ message: "Erreur pendant la récupération des documents" }));
  };


exports.getDocLinkDetails = (req, res) => {
    DocLink.findById(req.params.id)
      .then((dl) => {
        res.send(dl);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Document non trouvé",
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