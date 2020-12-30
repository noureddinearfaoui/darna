const Project = require("../models/project");

exports.addProject=(req,res)=>{
    delete req.body._id;
    const project=new Project({
        ...req.body,
    })
    project.save()
        .then(() => {
            res.status(200).json({ message:"project added successfully"})
        })
        .catch(error => {
             res.status(400).json({ error})
            })

}

exports.updateProject = (req, res) => {
    Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    )
      .then((project) => {
        if (!project) {
          return res.status(404).send({
            message: "Project not found",
          });
        }
        res.send(project);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Project not found",
          });
        }
        return res.status(500).send({
          message: "Error updating Project",
        });
      });
  };
  
  exports.deleteProject = (req, res) => {
    const idProject = req.params.id;
      Project.findById(idProject)
        .then((project) => {
          project
            .remove()
            .then(() =>{ 
              
              res.status(200).json({message:"project deleted successfully"});
            })
            .catch((error) =>
              res.status(500).json({ message: "Error server" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Project not  found" +error})
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
            message: "Project not found",
          });
        }
        return res.status(500).send({
          message: "Error server",
        });
      });
  };

  exports.getAllProjects = (req, res) => {
    Project.find()
      .then((projects) => {
        res.status(200).json(projects);
      })
      .catch((error) => res.status(404).json({ message: "can not get all projects" }));
  };