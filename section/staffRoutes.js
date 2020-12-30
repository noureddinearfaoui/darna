const express = require("express");
const router = express.Router();
const StaffCtrl=require("./controllers/staffController");

router.post("/addStaff",StaffCtrl.addStaff);
router.get("/getAllStaffs", StaffCtrl.getAllStaffs);
router.get("/getStaffDetails/:id",StaffCtrl.getStaffDetails);
router.put("/updateStaff/:id",StaffCtrl.updateStaff);
router.delete("/deleteStaff/:id",StaffCtrl.deleteStaff);

module.exports=router;