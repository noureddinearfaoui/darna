const UserController = require ("../../user/controller/userController");
const User = require("../../user/model/user");
const Action = require("../../action/model/action");
const Comment = require("../../comment/model/comment");


exports.addComment = (req, res, next) => {
  let idUser = req.body.member;
  let idAction = req.body.action;

  User.findById(idUser)
    .then((user) => {
      Action.findById(idAction)
        .then((action) => {
          const comment = new Comment({
            date: req.body.date,
            typeMessage: req.body.typeMessage,
            message: req.body.message,
            nameOfSender: user.firstName +" "+ user.lastName,
            urlImageOfSender: UserController.getImageFromDossierImagesAndCreateItIfNotExist(idUser,user.urlImage),
            member: user,
            action: action,
          });

          comment
            .save()
            .then(
              () => {
                comment.member = comment.member._id;
                comment.action = comment.action._id;
                res.status(200).json(comment);
            })
            .catch((error) =>
              res.status(500).json({ message: "error server" + error })
            );
        })
        .catch((error) =>
          res.status(404).json({ message: "Action non trouvé" })
        );
    })
    .catch((error) => res.status(404).json({ message: "Membre non trouvé" }));
};

exports.getAllCommentsByAction = (req, res) => {
  let id = req.params.idAction;

  Comment.find({ action: id })
    .sort({ date: 1 })
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Action not found",
        });
      }
      return res.status(500).send({
        message: "Server error",
      });
    });
};

exports.updateCommentsOfMember = (idUser,urlImageOfSender, nameOfSender)=>{
  Comment.find({member:idUser}).then((comments)=>{
    comments.forEach(comment=>{
      if(urlImageOfSender){
        comment.urlImageOfSender=urlImageOfSender;
      }
      if(nameOfSender){
        comment.nameOfSender=nameOfSender;
      }
      comment.save();
    });
  }).catch(err=>{
    console.log(err)
  });
}
