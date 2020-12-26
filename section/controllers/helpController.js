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
    .then(async() => {
      req.body.answers.forEach((el,i) => { 
        if(el.url){
          if(el.url && el.url.indexOf("base64")!==-1){
            let url =manageFiles.createFile(dirUploads,dir,el.url,help.answers[i]._id,
              `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}`,
              "/api/help/app/images/");
              help.answers.id(help.answers[i]._id).url=url;
          }
        }
      });
      await help.save();
      console.log("help:",help)
      res.status(200).json(help);
    })
    .catch((error) =>
      res.status(500).json({ message: "error server" + error })
    );
};
