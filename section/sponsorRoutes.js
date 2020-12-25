const express = require("express");
const router = express.Router();
const SponsorCtrl = require(".//controllers/sponsorController");

router.post("/addSponsor",SponsorCtrl.addSponsor);
router.get("/getAllSponsors", SponsorCtrl.getAllSponsors);
router.get("/getSponsorDetails/:id",SponsorCtrl.getSponsorDetails);
router.put("/updateSponsor/:id",SponsorCtrl.updateSponsor);
router.delete("/deleteSponsor/:id",SponsorCtrl.deleteSponsor);
router.get("/app/images/:nomImage", SponsorCtrl.getImageByNom);


module.exports = router;
