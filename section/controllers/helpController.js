const Help= require("../models/help")
const Link= require("../link")
const directory = require("../../pathDirectory");
const dirUploads = "uploads";
const dir = "uploads/helps";
const manageFiles = require("../../config/manageFiles");
require("dotenv").config();

exports.addHelp = (req, res) => {
  let answers=[];
  let table=req.body.answers;
  if(table && table.length!==0){
  table.forEach(element => {
    answers.push(new Link({
      description:element.description,
      //url: element.url
    }));
  });
  }
  const help = new Help({
    question: req.body.question, 
    answers:answers
  });
  help.save()
    .then(() => {
      help.answers.forEach((el) => { 
    if(el.url){
      let url =manageFiles.createFile(dirUploads,dir,el.url,el._id,
        `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}`,
        "/api/help/app/images/");
      el.url=url;
      el.save().then((resultat)=>{
        res.status(200).json(resultat);
      }).catch((error) =>
        res.status(500).json({ message: error })
      )}
      else {
        res.status(200).json(help);
      }
      });
      res.status(200).json(help);
    })
    .catch((error) =>
      res.status(500).json({ message: "error server" + error })
    );
};
