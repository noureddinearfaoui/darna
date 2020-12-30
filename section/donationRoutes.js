  
const express = require("express");
const router = express.Router();
const DonationCtrl = require("./controllers/donationController");

router.post("/manageDonation", DonationCtrl.manageDonation);
router.get("/getDonation", DonationCtrl.getDonation);


module.exports = router;