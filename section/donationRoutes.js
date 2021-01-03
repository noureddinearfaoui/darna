  
const express = require("express");
const router = express.Router();
const DonationCtrl = require("./controllers/donationController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/manageDonation", auth, permit("admin"), DonationCtrl.manageDonation);
router.get("/getDonation", DonationCtrl.getDonation);


module.exports = router;