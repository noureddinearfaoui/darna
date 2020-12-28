const express = require("express");
const router = express.Router();
const DocLinkCtrl = require("./controllers/docLinkController");

router.post("/addDocLink",DocLinkCtrl.addDocLink);
router.get("/getAllDocsLinks", DocLinkCtrl.getAllDocsLinks);
router.get("/getDocLinkDetails/:id",DocLinkCtrl.getDocLinkDetails);
router.put("/updateDocLink/:id",DocLinkCtrl.updateDocLink);
router.delete("/deleteDocLink/:id",DocLinkCtrl.deleteDocLink);
router.get("/app/files/:nomFile", DocLinkCtrl.getFileByNom);


module.exports = router;
