const express = require("express");
const router = express.Router();
const ProjectCtrl=require("./controllers/projectController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addProject", auth, permit("admin"),ProjectCtrl.addProject);
router.get("/getAllProjects", ProjectCtrl.getAllProjects);
router.get("/getProjectDetails/:id",ProjectCtrl.getProjectDetails);
router.put("/updateProject/:id", auth, permit("admin"),ProjectCtrl.updateProject);
router.put("/updateProjectStatus/:id", auth, permit("admin"),ProjectCtrl.updateProjectStatus);
router.delete("/deleteProject/:id", auth, permit("admin"),ProjectCtrl.deleteProject);

module.exports=router;