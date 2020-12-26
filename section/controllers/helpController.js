const Help= require("../models/help")
const Link= require("../link")


exports.addHelp = (req, res) => {
  let answers=[];
  let table=req.body.answers;
  if(table && table.length!==0){
  table.forEach(element => {
    answers.push(new Link({
      description:element.description,
      url: element.url
    }));
  });
  }
  const help = new Help({
    question: req.body.question, 
    answers:answers
  });
  help.save()
    .then(() => {
      res.status(200).json(help);
    })
    .catch((error) =>
      res.status(500).json({ message: "error server" + error })
    );
};
