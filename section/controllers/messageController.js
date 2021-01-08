const Message = require("../models/message");

exports.addMessage=(req,res)=>{
  if(!req.body.firstName ){
    return  res.status(400).json({ message: "Vous devez ajouter votre prénom"});
  }
  if(!req.body.lastName ){
    return  res.status(400).json({ message: "Vous devez ajouter votre nom"});
  }
  if(!req.body.email ){
    return  res.status(400).json({ message: "Vous devez ajouter votre email"});
  }
  if(!req.body.message ){
    return  res.status(400).json({ message: "Vous devez ajouter un message"});
  }
    const message=new Message({
       firstName:req.body.firstName,
       lastName: req.body.lastName,
       email:req.body.email,
       message:req.body.message,
    })
    message.save()
        .then(() => {
            res.status(200).json({ message: "Message envoyé avec succès"})
        })
        .catch(error => {
             res.status(400).json({ error})
            })
}

  exports.deleteMessage = (req, res) => {
    const idMessage = req.params.id;
      Message.findById(idMessage)
        .then((msg) => {
            msg
            .remove()
            .then(() =>{ 
              
              res.status(200).json({message:"Message supprimé avec succès"});
            })
            .catch((error) =>
              res.status(500).json({ message: "Erreur serveur" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Message non trouvé" +error})
        );
  };

  exports.getMessageDetails = (req, res) => {
    Message.findById(req.params.id)
      .then((msg) => {
        res.send(msg);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Message non trouvé",
          });
        }
        return res.status(500).send({
          message: "Erreur serveur",
        });
      });
  };

  exports.getAllMessages = (req, res) => {
    Message.find()
      .then((messages) => {
        res.status(200).json(messages);
      })
      .catch((error) => res.status(404).json({ message: "Erreur"+error }));
  };