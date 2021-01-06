const Donation=require("../models/donation");
exports.manageDonation = (req, res) => {
    let idDon=req.body._id
    if(idDon){
      Donation.findById(idDon)
      .then((dn) => {
        if(dn){ 
          if(req.body.urlDonation){
            dn.urlDonation=req.body.urlDonation;
          }
          dn
          .save()
          .then(() =>{ 
          res.status(200).json(dn);
           })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
        }
        else{
           res.status(404).json({ message: "Donation non trouvée"});
        }
      })
      .catch((error) =>
        res.status(404).json({ message: "Erreur de récupération" })
      );
  
    }
    else {
      Donation.find()
      .then((dns) =>{ 
        if (dns.length==0){
          const dnn = new Donation({
            urlDonation:req.body.urlDonation
          });
          dnn.save()
        .then(() => {
            res.status(200).json(dnn);
          })
          .catch((error) =>
            res.status(500).json({ message: "erreur serveur" + error })
          );
        }
        else{
          res.status(400).json({ message: "Ajout interdit"})
        }
        
         })
         .catch((error) =>
        res.status(500).json({ message: "Erreur serveur" })
      );
     
    }
  };




exports.getDonation = (req, res, next) => {
  Donation.find()
    .then((donation) => {
        res.status(200).json(donation); 
    })
    .catch((error) => res.status(400).json({ message: "Erreur de récupération" }));
};