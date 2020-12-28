const Help= require("../models/help")
const Link= require("../link")
const dir = "uploads/helps";
const manageFiles = require("../../config/manageFiles");
require("dotenv").config();

exports.addHelp = (req, res) => {
  let answers=[];
  let table=req.body.answers;
  if(table && table.length!==0){
  table.forEach(element => {
    let newLink=new Link({
      description:element.description,
    });
    if(element.url && element.url.indexOf("base64")===-1){
      newLink.url=element.url;
    }
    answers.push(newLink);
  });
  }
  const help = new Help({
    question: req.body.question, 
    answers:answers
  });
  help.save()
    .then(() => {
      req.body.answers.forEach((el,i) => { 
        if(el.url){
          if(el.url && el.url.indexOf("base64")!==-1){
            let url =manageFiles.createFile(dir,el.url,help.answers[i]._id,
              "/api/help/app/files/");
              help.answers.id(help.answers[i]._id).url=url;
          }
        }
      });
       help.save()
       .then(()=>{
        res.status(200).json(help);
       })
      .catch(()=> res.status(500).json({ message: "error server" + error }))
     
    })
    .catch((error) =>
      res.status(500).json({ message: "error server" + error })
    );
};

exports.getFileByNom = (req, res) => {
  let urlFile=manageFiles.getFileByNom(dir,req.params.nomFile);
  if (!urlFile) {
    return res.status(404).json({ message: "Fichier n'existe pas!!" });
  }
  return res.sendFile(urlFile);
};

exports.getAllHelps = (req, res, next) => {
  Help.find()
    .then((helps) => {
      res.status(200).json(helps);
    })
    .catch((error) => res.status(404).json({ message: "Erreur pendant la récupération des aides" }));
};


exports.getHelpDetails = (req, res) => {
  Help.findById(req.params.id)
    .then((help) => {
      res.send(help);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Aide non trouvée",
        });
      }
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};

exports.deleteHelp = (req, res) => {
  const idHelp = req.params.id;
    Help.findById(idHelp)
      .then((help) => {
        help.answers.forEach((el) => { 
          manageFiles.deleteFile(dir,el._id);
        });
        help
          .remove()
          .then(() =>{ 
            res.status(200).json({message:"Aide supprimée avec succès"});
          })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
      })
      .catch((error) =>
        res.status(404).json({ message: "Aide non trouvée" })
      );
};

exports.updateQuestion= (req, res) => {
  const idHelp = req.params.id;
  Help.findById(idHelp)
  .then((help) => {
    if(req.body.question){
      help.question = req.body.question;
    } 
      help.save().then(()=>{
        res.status(200).json(help);
      }).catch((error) =>
        res.status(404).json({ message: error })
      );
        
  })
  .catch((error) =>
    res.status(404).json({ message: "Aide non trouvée" })
  );
};

exports.deleteAnswerByIdHelpAndIdAnswer = (req, res) => {
  const idHelp = req.params.id;
  const idAns= req.params.idAnswer;
    Help.findById(idHelp)
      .then((help) => {
        help.answers.id(idAns).remove();
        help.save()
        .then(()=>{
          manageFiles.deleteFile(dir,idAns);
          res.status(200).json({message:"Réponse supprimée avec succès"});
        })
        .catch((error) =>
        res.status(404).json({ message: error})
      );
        
      })
      .catch((error) =>
        res.status(404).json({ message: "Aide non trouvée" })
      );
};

exports.addAnswerByIdHelp = (req, res) => {
    const idHelp=req.params.id;
    Help.findById(idHelp)
    .then((help) => {
       let newLink=new Link({
        description:req.body.description,
     });
     
    if(req.body.url && req.body.url.indexOf("base64")===-1){
      newLink.url=req.body.url;
    }
    else if(req.body.url){
      let url =manageFiles.createFile(dir,req.body.url,newLink._id,
        "/api/help/app/files/");
        newLink.url=url;
      }
      help.answers.push(newLink);
      help.save()
      .then(()=>{
       res.status(200).json(help);
      })
      .catch((error) =>
       res.status(400).json(error)
      );
    })
    .catch((error) =>
      res.status(404).json({ message: "Aide non trouvée" })
    );
};


exports.updateAnswerByIdHelpAndIdAnswer = (req, res) => {
  const idHelp = req.params.id;
  const idAns= req.params.idAnswer;
  const url=req.body.url;
  const description=req.body.description;
    Help.findById(idHelp)
      .then((help) => {
      let reponse= help.answers.id(idAns);
      if(url && url.indexOf("base64")===-1){
        reponse.url=url;
      }
       else if(url){
        let linkPicture=manageFiles.createFile(dir,url,reponse._id,
          "/api/help/app/files/");
        reponse.url=linkPicture;
        }
      reponse.description=description;
      help.save()
      .then(()=>{
        res.status(200).json(help);
      })
      .catch((error) =>
      res.status(404).json(error)
    );
      })
      .catch((error) =>
        res.status(404).json({ message: "Aide non trouvée" })
      );
};





