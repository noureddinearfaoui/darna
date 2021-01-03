const express = require("express");
const router = express.Router();
const SponsorCtrl = require(".//controllers/sponsorController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addSponsor", auth, permit("admin"),SponsorCtrl.addSponsor);
router.get("/getAllSponsors", SponsorCtrl.getAllSponsors);
router.get("/getSponsorDetails/:id", auth, permit("admin"),SponsorCtrl.getSponsorDetails);
router.put("/updateSponsor/:id", auth, permit("admin"),SponsorCtrl.updateSponsor);
router.delete("/deleteSponsor/:id", auth, permit("admin"),SponsorCtrl.deleteSponsor);
router.get("/app/images/:nomImage", SponsorCtrl.getImageByNom);


module.exports = router;
