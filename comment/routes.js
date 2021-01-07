const express = require("express");
const router = express.Router();
const commentCtrl = require("./controller/commentController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post(
  "/addComment",
  auth,
  permit("admin", "membre"),
  commentCtrl.addComment
);
router.get(
  "/getAllCommentsByAction/:idAction",
  auth,
  permit("admin", "membre"),
  commentCtrl.getAllCommentsByAction
);
router.get("/app/images/:nomImage", commentCtrl.getImageByNom);
module.exports = router;
