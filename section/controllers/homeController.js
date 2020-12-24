const Home= require("../models/home");

exports.manageHome = (req, res) => {
  let idHome=req.body._id
  if(idHome){
    Home.findById(idHome)
    .then((home) => {
      home.presentation=req.body.presentation;
      home.donation=req.body.donation;
      home.goals=req.body.goals;
      home.announcements=req.body.announcements;
      home
        .save()
        .then(() =>{ 
        res.status(200).json(home);
         })
        .catch((error) =>
          res.status(500).json({ message: "Erreur serveur" + error })
        );
    })
    .catch((error) =>
      res.status(404).json({ message: "Erreur de récupération" })
    );
  }
  else {
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
};



exports.getHome = (req, res, next) => {
  Home.find()
    .then((home) => {
        res.status(200).json(home); 
    })
    .catch((error) => res.status(400).json({ message: "Erreur de récupération" }));
};