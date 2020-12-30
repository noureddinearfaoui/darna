const express = require("express");
const router = express.Router();
const StaffCtrl=require("./controllers/staffController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addStaff", auth, permit("admin"),StaffCtrl.addStaff);
router.get("/getAllStaffs", StaffCtrl.getAllStaffs);
router.get("/getStaffDetails/:id", auth, permit("admin"),StaffCtrl.getStaffDetails);
router.put("/updateStaff/:id", auth, permit("admin"),StaffCtrl.updateStaff);
router.delete("/deleteStaff/:id", auth, permit("admin"),StaffCtrl.deleteStaff);

module.exports=router;