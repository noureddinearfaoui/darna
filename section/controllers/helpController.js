const Help= require("../models/help")
const Link= require("../link")


exports.addHelp = (req, res) => {
       const link= new Link({
         description:req.body.description,
         url: req.body.url
       });
        const help = new Help({
          question: req.body.question, 
        });
        help.answer.push(link);
          help.save()
          .then(() => {
            res.status(200).json(help);
          })
          .catch((error) =>
            res.status(500).json({ message: "error server" + error })
          );
      
  };
