const Staff = require("../models/staff");

exports.addStaff=(req,res)=>{
  if(req.body.role && (req.body.role!=="président"&& req.body.role!=="vice-président"&& req.body.role!=="secrétaire-générale"&& req.body.role!=="trésorier")){
    return  res.status(400).json({ message: "Role incorrecte"});
    }
  if(!req.body.fullName ){
    return  res.status(400).json({ message: "Vous devez ajouter le nom complet"});
  }
  if(!req.body.email ){
    return  res.status(400).json({ message: "Vous devez ajouter un email"});
  }
    const staff=new Staff({
        role:req.body.role,
        fullName: req.body.fullName,
        email:req.body.email,
    })
    staff.save()
        .then(() => {
            res.status(200).json(staff)
        })
        .catch(error => {
             res.status(400).json({ error})
            })
}

exports.updateStaff = (req, res) => {
    if(req.body.role && (req.body.role!=="président"&& req.body.role!=="vice-président"&& req.body.role!=="secrétaire-générale"&& req.body.role!=="trésorier")){
        return  res.status(400).json({ message: "Role incorrecte"});
        }
   Staff.findById(req.params.id)
   .then((staff)=>{
    if(req.body.email){
        staff.email = req.body.email;
    }
    if(req.body.fullName){
        staff.fullName = req.body.fullName;
    }
    staff.role = req.body.role;
    staff.save().then((resultat)=>{
        res.status(200).json(resultat);
      }).catch((error) =>
        res.status(500).json({ message: error })
      );
   })
   .catch((error) =>
    res.status(404).json({ message: "Personnel non trouvé" })
  );
     
  };
  
  exports.deleteStaff = (req, res) => {
    const idStaff = req.params.id;
      Staff.findById(idStaff)
        .then((staff) => {
            staff
            .remove()
            .then(() =>{ 
              
              res.status(200).json({message:"Personnel supprimé avec succès"});
            })
            .catch((error) =>
              res.status(500).json({ message: "Erreur serveur" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Personnel non trouvé" +error})
        );
  };

  exports.getStaffDetails = (req, res) => {
    Staff.findById(req.params.id)
      .then((staff) => {
        res.send(staff);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Personnel non trouvé",
          });
        }
        return res.status(500).send({
          message: "Erreur serveur",
        });
      });
  };

  exports.getAllStaffs = (req, res) => {
    Staff.find()
      .then((staffs) => {
        res.status(200).json(staffs);
      })
      .catch((error) => res.status(404).json({ message: "Erreur"+error }));
  };