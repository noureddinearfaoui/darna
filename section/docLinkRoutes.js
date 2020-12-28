const express = require("express");
const router = express.Router();
const DocLinkCtrl = require("./controllers/docLinkController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addDocLink", auth, permit("admin"),DocLinkCtrl.addDocLink);
router.get("/getAllDocsLinks", DocLinkCtrl.getAllDocsLinks);
router.get("/getDocLinkDetails/:id", auth, permit("admin"),DocLinkCtrl.getDocLinkDetails);
router.put("/updateDocLink/:id", auth, permit("admin"),DocLinkCtrl.updateDocLink);
router.delete("/deleteDocLink/:id", auth, permit("admin"),DocLinkCtrl.deleteDocLink);
router.get("/app/files/:nomFile", DocLinkCtrl.getFileByNom);


module.exports = router;
