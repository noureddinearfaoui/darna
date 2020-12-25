const Home= require("../models/home");

exports.manageHome = (req, res) => {
  let idHome=req.body._id
  if(idHome){
    Home.findById(idHome)
    .then((home) => {
      if(home){ 
        if(req.body.presentation){
          home.presentation=req.body.presentation;
        } 
        if(req.body.donation){
          home.donation=req.body.donation;
        } 
        if(req.body.goals){
          home.goals=req.body.goals;
        } 
        if(req.body.announcements){
          home.announcements=req.body.announcements;
        } 
      home
        .save()
        .then(() =>{ 
        res.status(200).json(home);
         })
        .catch((error) =>
          res.status(500).json({ message: "Erreur serveur" + error })
        );
      }
      else{
         res.status(404).json({ message: "Accueil non trouvé"});
      }
    })
    .catch((error) =>
      res.status(404).json({ message: "Erreur de récupération" })
    );

  }
  else {
    Home.find()
    .then((homes) =>{ 
      if (homes.length==0){
        const hm = new Home({
          presentation:req.body.presentation,
          donation:req.body.donation,
          goals:req.body.goals,
          announcements:req.body.announcements,
        });
       hm.save()
      .then(() => {
          res.status(200).json(hm);
        })
        .catch((error) =>
          res.status(500).json({ message: "erreur serveur" + error })
        );
      }
      else{
        res.status(403).json({ message: "Ajout interdit"})
      }
      
       })
       .catch((error) =>
      res.status(500).json({ message: "Erreur serveur" })
    );
   
  }
};



exports.getHome = (req, res, next) => {
  Home.find()
    .then((home) => {
        res.status(200).json(home); 
    })
    .catch((error) => res.status(400).json({ message: "Erreur de récupération" }));
};