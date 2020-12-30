const Project = require("../models/project");

exports.addProject=(req,res)=>{
  if(req.body.projectStatus && (req.body.projectStatus!=="en-cours"&& req.body.projectStatus!=="future")){
    return  res.status(400).json({ message: "Statut incorrecte"});
    }
  if(!req.body.projectDescription ){
    return  res.status(400).json({ message: "Vous devez ajouter la description du projet"});
  }
    const project=new Project({
      projectStatus:req.body.projectStatus,
      projectDescription: req.body.projectDescription,
    })
    project.save()
        .then(() => {
            res.status(200).json(project)
        })
        .catch(error => {
             res.status(400).json({ error})
            })
}

exports.updateProject = (req, res) => {
  if(req.body.projectStatus && (req.body.projectStatus!=="en-cours"&& req.body.projectStatus!=="future")){
    return  res.status(400).json({ message: "Statut incorrecte"});
    }
   Project.findById(req.params.id)
   .then((project)=>{
    if(req.body.projectDescription){
      project.projectDescription = req.body.projectDescription;
    }
      project.projectStatus = req.body.projectStatus;

      project.save().then((resultat)=>{
        res.status(200).json(resultat);
      }).catch((error) =>
        res.status(500).json({ message: error })
      );
   })
   .catch((error) =>
    res.status(404).json({ message: "Projet non trouvé" })
  );
     
  };
  exports.updateProjectStatus = (req, res) => {
    if(req.body.projectStatus && (req.body.projectStatus!=="en-cours"&& req.body.projectStatus!=="future")){
      return  res.status(400).json({ message: "Statut incorrecte"});
      }
     Project.findById(req.params.id)
     .then((project)=>{
        project.projectStatus = req.body.projectStatus;
        project.save().then((resultat)=>{
          res.status(200).json(resultat);
        }).catch((error) =>
          res.status(500).json({ message: error })
        );
     })
     .catch((error) =>
      res.status(404).json({ message: "Projet non trouvé" })
    );
       
    };
  
  exports.deleteProject = (req, res) => {
    const idProject = req.params.id;
      Project.findById(idProject)
        .then((project) => {
          project
            .remove()
            .then(() =>{ 
              
              res.status(200).json({message:"Projet supprimé avec succès"});
            })
            .catch((error) =>
              res.status(500).json({ message: "Erreur serveur" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Projet non trouvé" +error})
        );
  };

  exports.getProjectDetails = (req, res) => {
    Project.findById(req.params.id)
      .then((project) => {
        res.send(project);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Projet non trouvé",
          });
        }
        return res.status(500).send({
          message: "Erreur serveur",
        });
      });
  };

  exports.getAllProjects = (req, res) => {
    Project.find()
      .then((projects) => {
        res.status(200).json(projects);
      })
      .catch((error) => res.status(404).json({ message: "Erreur"+error }));
  };