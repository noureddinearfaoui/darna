const User = require("../model/user");
const DemandeParticipation = require("../../demandeParticipation/model/demandeParticipation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const password = require("secure-random-password");
const email = require("../../config/email");
const dir = "uploads/users";
const manageFiles = require("../../config/manageFiles");
const commentCtrl = require("../../comment/controller/commentController");
require("dotenv").config();

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      delete req.body._id;
      const user = new User({
        ...req.body,
      });
      user.password = hash;
      user
        .save()
        .then(() => {
          const message = {
            from: process.env.EMAIL_USER, // Sender address
            to: user.email, // List of recipients
            subject: "Confirmer votre compte", // Subject line
            html: `<p>Bonjour<strong> ${user.firstName} ${
              user.lastName
            }</strong>!<br>
                        Pour confirmer votre compte utilisez ce lien:
                        <a href= "${
                          process.env.SERVER_FRONTEND_ADDRESS ||
                          "http://localhost:4200"
                        }/pages/confirmEmail/${user._id}">Confirmer</a></p>`,
            // Plain text body
          };
          res.status(201).json({ message: "Utilisateur créé !" });
          email.send(message);
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }

          if (user.banni)
            return res.status(401).json({ error: "vous êtes banni !" });

          if (!user.confirm) {
            const message = {
              from: process.env.EMAIL_USER, // Sender address
              to: user.email, // List of recipients
              subject: "Confirmer votre compte", // Subject line
              html: `<p>Bonjour<strong> ${user.firstName} ${
                user.lastName
              }</strong>!<br>
                          Pour confirmer votre compte utilisez ce lien:
                          <a href= "${
                            process.env.SERVER_FRONTEND_ADDRESS ||
                            "http://localhost:4200"
                          }/pages/confirmEmail/${user._id}">Confirmer</a></p>`,
            };
            email.send(message);
            return res
              .status(401)
              .json({ error: "vous devez confirmer votre compte !" });
          } else {
            if (!user.accepted)
              return res
                .status(401)
                .json({ error: "vous n êtes pas encore accepter !" });
            //socket.emit('notification', user);
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                {
                  userId: user._id,
                  role: user.role,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  urlImage: user.urlImage,
                },
                process.env.RANDOM_TOKEN_SECRET,
                { expiresIn: "24h" }
              ),
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.confirmAccount = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user.confirm) res.status(404).json({ message: "utilisateur déjà confirmé" });
      else {
        user.confirm = true;
        user
          .save()
          .then(() => res.status(200).json({ message: "Confirmé!" }))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.test = (req, res, next) => {
  res.status(200).json({ message: "test permession!" });
};

// Find a single member
exports.getUserDetails = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Membre non trouvé",
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Membre non trouvé",
        });
      }
      return res.status(500).send({
        message: "Erreur",
      });
    });
};
// Update member details
exports.updateUserDetails = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if(req.body.email){
        user.email = req.body.email;
      }
      if(req.body.firstName){
        user.firstName = req.body.firstName;
      }
      if(req.body.lastName){
        user.lastName = req.body.lastName;
      }
      if(req.body.adress){
        user.adress = req.body.adress;
      }
      if(req.body.tel){
        user.tel = req.body.tel;
      }
      if(req.body.dateOfBirth){
        user.dateOfBirth = req.body.dateOfBirth;
      }
      if(req.body.confirm){
        user.confirm = req.body.confirm;
      }
      if(req.body.accepted){
        user.accepted = req.body.accepted;
      }
      let urlImage=req.body.urlImage;
      if(req.body.urlImage){
        if (req.body.urlImage.indexOf("base64")!==-1) { 
         urlImage=manageFiles.createFile(dir,req.body.urlImage,user._id,
          "/api/user/app/images/");
        user.urlImage=urlImage;
        }
        else{
          user.urlImage=req.body.urlImage;
        }
      }
      user.save().then((resultat)=>{
        res.status(200).json(resultat);
        commentCtrl.updateCommentsOfMember(
          user._id,
          urlImage,
          user.firstName + " " + user.lastName
        );
      }).catch((error) =>
        res.status(500).json({ message: error })
      );
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Membre non trouvé",
        });
      }
      return res.status(500).send({
        message: "Erreur",
      });
    });
};
//Ajouter un membre

exports.addMember = (req, res) => {
  const pass = password.randomPassword();
  bcrypt.hash(pass, 10).then((hash) => {
    const user = new User({
      ...req.body,
    });
    user.password = hash;
    user.accepted = true;
    user
      .save()
      .then((usr) => {
        if (req.body.urlImage) {
          if (req.body.urlImage.indexOf("base64")!==-1) {
          let urlImage=manageFiles.createFile(dir,req.body.urlImage,usr._id,
            "/api/user/app/images/");
            usr.urlImage=urlImage;
          }
          else{
            usr.urlImage=req.body.urlImage;
          }
        }
        usr.save()
        .then(()=>{
          res.status(201).json({
            message: "Membre ajouté avec succès",
          });
          console.log("ppppp", pass);
        })
        .catch((error) => {
          res.status(500).json({ error: error });
        });       
        const message = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Confirmer votre compte",
          html: `<p>Bonjour<strong> ${user.firstName} ${
            user.lastName
          }</strong>!<br>
                   Votre mot de passe est: <strong> ${pass}</strong><br>
                      Pour confirmer votre compte utilisez ce lien:
                      <a href= "${
                        process.env.SERVER_FRONTEND_ADDRESS ||
                        "http://localhost:4200"
                      }/pages/confirmEmail/${user._id}">Confirmer</a></p>`,
        };
        email.send(message);
       
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  });
};
exports.getAllUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!users.length) {
      return res.status(404).json({ error: `Utilisateurs non trouvés` });
    }
    return res.status(200).json(users);
  }).catch((err) => console.log(err));
};

exports.getAcceptedMembers = (req, res, next) => {
  User.find({ accepted: "true", confirm: "true", role: "membre" })
    .then((users) => {
      if (users) {
        res.status(200).json(users);
      } else res.status(404).json({ message: "Utilisateurs non trouvés" });
    })
    .catch((error) => res.status(400).json({ message: "Utilisateurs non trouvés" }));
};

exports.getDemandes = (req, res, next) => {
  User.find({ accepted: "false", confirm: "true", role: "membre" })
    .then((users) => {
      if (users) {
        res.status(200).json(users);
      } else res.status(404).json({ message: "Demandes non trouvées" });
    })
    .catch((error) => res.status(400).json({ message: "Demandes non trouvées" }));
};

//bannir member
exports.banniMember = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      banni: req.body.banni,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Membre non trouvé",
        });
      }
      res.status(201).send({
        message: "Membre banni",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Membre non trouvé",
        });
      }
      return res.status(500).send({
        message: "Erreur",
      });
    });
};

exports.NouveauAdhsion = (req, res) => {
  let userId = req.params.id;
  let date = req.body.nouveauAdhesionDate;
  console.log(userId);
  User.findById(userId)
    .then((user) => {
      user.renewal.push(date);
      user.save().then(() => {
        res.status(200).json({
          message: "Succès",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur" + err,
      });
    });
};

exports.adhsionUser = (req, res) => {
  let userId = req.headers.userid;

  User.findById(userId)
    .then((user) => {
      res.status(200).json(user.renewal);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Erreur" + err,
      });
    });
};
exports.getUserByEmail = (req, res) => {
  let userEmail = req.params.email;

  User.findOne({ email: userEmail })
    .then((user) => {
      if (user) {
        res.status(200).json({ user: user });
      } else res.status(200).json("Utilisateur non trouvé");
    })
    .catch((err) => {
      console.log(err);
      console.log("error");
      res.status(500).json({
        message: "Erreur",
      });
    });
};
// delete member by id
exports.deleteOneMember = (req, res) => {
  const idUser=req.params.id;
  DemandeParticipation.remove({ member: idUser}).then(() => {
    User.findByIdAndRemove(idUser)
    .then((user) => {
      user
        .remove()
        .then(() =>{ 
          manageFiles.deleteFile(dir,idUser);
          res.status(200).json({message:"Utilisateur supprimé avec succès"});
        })
        .catch((error) =>
          res.status(500).json({ message: "Erreur serveur" + error })
        );
    })
    .catch((error) =>
      res.status(404).json({ message: "Utilisateur non trouvé" })
    );
  });
};

// accepted=true
exports.acceptMember = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      accepted: "true",
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Utilisateur non trouvé",
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Utilisateur non trouvé",
        });
      }
      return res.status(500).send({
        message: "Erreur",
      });
    });
};

exports.getImageByNom = (req, res) => {
  let urlImage=manageFiles.getFileByNom(dir,req.params.nomImage);
  if (!urlImage) {
    return res.status(404).json({ message: "Image n'existe pas!!" });
  }
  return res.sendFile(urlImage);
};
//update user details

exports.updateConnectedUser = (req, res) => {
  const idUser = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  const userId = decodedToken.userId;
  if (userId !== idUser) {
    return res.status(401).send({
      message: "Vous n'êtes pas l'utilisateur connecté",
    });
  } else {
    User.findById(idUser)
      .then((user) => {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.adress = req.body.adress;
        user.tel = req.body.tel;
        user
          .save()
          .then(() =>{ 
          commentCtrl.updateCommentsOfMember(user._id,"",user.firstName + " " + user.lastName );
          res.status(200).json({message:"Votre compte a été modifié avec succès"});
           })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
      })
      .catch((error) =>
        res.status(404).json({ message: "Utilisateur non trouvé" })
      );
  }
};

exports.updatePassword = (req, res, next) => {
  const idUser = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  const userId = decodedToken.userId;
  if (userId !== idUser) {
    return res.status(401).send({
      message: "Vous n'êtes pas l'utilisateur connecté",
    });
  } else {
    User.findById(idUser)
      .then((user) => {
        bcrypt
          .compare(req.body.oldPassword, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(404).json({
                error: "Veuillez entrer votre mot de passe courant correctement !",
              });
            }

            bcrypt.hash(req.body.newPassword, 10).then((hash) => {
              user.password = hash;
              user
                .save()
                .then(() => res.status(200).json({message:"Votre mot de passe a été modifié avec succès"}))
                .catch((error) =>
                  res.status(500).json({ message: "Erreur serveur" + error })
                );
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) =>
        res.status(404).json({ message: "Utilisateur non trouvé" })
      );
  }
};


exports.getConnectedUserdetails = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Utilisateur non trouvé",
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Utilisateur non trouvé",
        });
      }
      return res.status(500).send({
        message: "Erreur serveur",
      });
    });
};


exports.updateConnectedUserImage = (req, res) => {
  const idUser = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  const userId = decodedToken.userId;
  if (userId !== idUser) {
    return res.status(401).send({
      message: "Vous n'êtes pas l'utilisateur connecté",
    });
  } else {
    User.findById(idUser)
      .then((user) => {
        let urlImage= req.body.newurlImage;
        if(req.body.newurlImage){
          if (req.body.newurlImage.indexOf("base64")!==-1) {
          
           urlImage=manageFiles.createFile(dir,req.body.newurlImage,user._id,
            "/api/user/app/images/");
          user.urlImage=urlImage;
          }
          else{
            user.urlImage=req.body.newurlImage;
          }
        }
        user.save()
        .then(() => {
          commentCtrl.updateCommentsOfMember(user._id,urlImage,null);
          res.status(200).json({message:"Votre image a été modifié avec succès",urlImage:urlImage})
        })
        .catch((error) =>
          res.status(500).json({ message: "Erreur serveur" + error })
        );
      })
      .catch((error) =>
        res.status(404).json({ message: "Utilisateur non trouvé" })
      );
  }
};
