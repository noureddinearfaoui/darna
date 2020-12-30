const express = require("express");
const router = express.Router();
const ProjectCtrl=require("./controllers/projectController");

router.post("/addProject",ProjectCtrl.addProject);
router.get("/getAllProjects", ProjectCtrl.getAllProjects);
router.get("/getProjectDetails/:id",ProjectCtrl.getProjectDetails);
router.put("/updateProject/:id",ProjectCtrl.updateProject);
router.delete("/deleteProject/:id",ProjectCtrl.deleteProject);

module.exports=router;