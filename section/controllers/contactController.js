const Contact=require("../models/contact");

exports.manageContact = (req, res) => {
    let idContact=req.body._id
    if(idContact){
      Contact.findById(idContact)
      .then((contact) => {
        if(contact){ 
          if(req.body.address){
            contact.address=req.body.address;
          } 
          if(req.body.phone){
            contact.phone=req.body.phone;
          } 
          if(req.body.email){
            contact.email=req.body.email;
          } 
          
        contact
          .save()
          .then(() =>{ 
          res.status(200).json(contact);
           })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
        }
        else{
           res.status(404).json({ message: "Contact non trouvé"});
        }
      })
      .catch((error) =>
        res.status(404).json({ message: "Contact non récupéré"+error })
      );
  
    }
    else {
      Contact.find()
      .then((contacts) =>{ 
        if (contacts.length==0){
          const ctct = new Contact({
            address:req.body.address,
            phone:req.body.phone,
            email:req.body.email,
            
          });
         ctct.save()
        .then(() => {
            res.status(200).json(ctct);
          })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
        }
        else{
          res.status(403).json({ message: "Ajout interdit"})
        }
        
         })
         .catch((error) =>
        res.status(500).json({ message: "Erreur serveur"+error })
      );
     
    }
  };
  
  
  
  exports.getContact = (req, res, next) => {
    Contact.find()
      .then((contact) => {
          res.status(200).json(contact); 
      })
      .catch((error) => res.status(400).json({ message: "Contact non trouvé" }));
  };