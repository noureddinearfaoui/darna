const User = require("../model/user");
const DemandeParticipation = require("../../demandeParticipation/model/demandeParticipation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const password = require("secure-random-password");
const Role = require("../../role/model/role");
const user = require("../model/user");
const email = require("../../config/email");
const fs = require("fs");
const directory = require("../../pathDirectory");
const dir = "images";
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
            let urlImage = getImageFromDossierImagesAndCreateItIfNotExist(
              user._id,
              user.urlImage
            );
            //socket.emit('notification', user);
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                {
                  userId: user._id,
                  role: user.role,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  urlImage: urlImage,
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
  User.findById(req.params.id).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 })
    .then((user) => {
      if (user.confirm) res.status(404).json({ message: "Confirmed! deja" });
      else {
        user.confirm = true;
        user
          .save()
          .then(() => res.status(200).json({ message: "Confirmed!" }))
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
          message: "Member not found ",
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Member not found ",
        });
      }
      return res.status(500).send({
        message: "Error retrieving member details",
      });
    });
};
// Update member details
exports.updateUserDetails = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Member not found",
        });
      }
      let urlImage = "";
      if (req.body.urlImage) {
        if (fs.existsSync(dir)) {
          let files = fs.readdirSync(dir);
          if (files.find((el) => el.indexOf(user._id) !== -1)) {
            let fileT = files.find((el) => el.indexOf(user._id) !== -1);
            fs.unlinkSync(dir + "/" + fileT, () => {});
          }
        }
        let buff = Buffer.from(user.urlImage.split(";base64,")[1], "base64");
        let extension = user.urlImage.split(";base64,")[0].split("/")[1];
        let fileName = dir + "/" + user._id + "." + extension;
        fs.writeFileSync(fileName, buff);
        let file = user._id + "." + extension;
        urlImage =
          `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +
          "/api/user/app/images/" +
          file;
      }
      commentCtrl.updateCommentsOfMember(
        user._id,
        urlImage,
        user.firstName + " " + user.lastName
      );
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Member not found",
        });
      }
      return res.status(500).send({
        message: "Error updating details",
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
      .then(() => {
        const message = {
          from: process.env.EMAIL_USER, // Sender address
          to: user.email, // List of recipients
          subject: "Confirmer votre compte", // Subject line
          html: `<p>Bonjour<strong> ${user.firstName} ${
            user.lastName
          }</strong>!<br>
                   Votre mot de passe est: <strong> ${pass}</strong><br>
                      Pour confirmer votre compte utilisez ce lien:
                      <a href= "${
                        process.env.SERVER_FRONTEND_ADDRESS ||
                        "http://localhost:4200"
                      }/pages/confirmEmail/${user._id}">Confirmer</a></p>`,
          // Plain text body
        };
        email.send(message);
        res.status(201).json({
          message: "member added successfully",
        });
        console.log("ppppp", pass);
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
      return res.status(404).json({ error: `User not found` });
    }
    return res.status(200).json(users);
  }).catch((err) => console.log(err));
};

exports.getAcceptedMembers = (req, res, next) => {
  User.find({ accepted: "true", confirm: "true", role: "membre" })
    .select({
      email: 1,
      firstName: 1,
      lastName: 1,
      adress: 1,
      tel: 1,
      dateOfBirth: 1,
      banni: 1,
      accepted: 1,
      confirm: 1,
      renewal: 1,
    })
    .then((users) => {
      if (users) {
        res.status(200).json(users);
      } else res.status(404).json({ message: "Users not found" });
    })
    .catch((error) => res.status(400).json({ message: "Users not found" }));
};

exports.getDemandes = (req, res, next) => {
  User.find({ accepted: "false", confirm: "true", role: "membre" })
    .select({
      email: 1,
      firstName: 1,
      lastName: 1,
      adress: 1,
      tel: 1,
      dateOfBirth: 1,
      banni: 1,
      accepted: 1,
      confirm: 1,
      renewal: 1,
    })
    .then((users) => {
      if (users) {
        res.status(200).json(users);
      } else res.status(404).json({ message: "Demandes not found" });
    })
    .catch((error) => res.status(400).json({ message: "Demandes not found" }));
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
          message: "Member not found",
        });
      }
      res.status(201).send({
        message: "Member banni",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Member not found",
        });
      }
      return res.status(500).send({
        message: "Error bannir",
      });
    });
};

exports.NouveauAdhsion = (req, res) => {
  let userId = req.params.id;
  let date = req.body.nouveauAdhesionDate;
  console.log(userId);
  User.findById(userId).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 })
    .then((user) => {
      user.renewal.push(date);
      user.save().then(() => {
        res.status(200).json({
          message: "Success",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong, please try again later." + err,
      });
    });
};

exports.adhsionUser = (req, res) => {
  let userId = req.headers.userid;

  User.findById(userId).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 })
    .then((user) => {
      res.status(200).json(user.renewal);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong, please try again later." + err,
      });
    });
};
exports.getUserByEmail = (req, res) => {
  let userEmail = req.params.email;

  User.findOne({ email: userEmail }).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 })
    .then((user) => {
      if (user) {
        res.status(200).json({ user: user });
      } else res.status(200).json("pas de user");
    })
    .catch((err) => {
      console.log(err);
      console.log("error");
      res.status(500).json({
        message: "user not found",
      });
    });
};
// delete member by id
exports.deleteOneMember = (req, res) => {
  DemandeParticipation.remove({ member: req.params.id }).then(() => {
    User.findByIdAndRemove(req.params.id).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
      banni:1,accepted:1 ,renewal:1 ,role:1 })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "Member not found",
          });
        }
        if (fs.existsSync(dir)) {
          let files = fs.readdirSync(dir);
          if (files.find((el) => el.indexOf(user._id) !== -1)) {
            file = files.find((el) => el.indexOf(user._id) !== -1);
            fs.unlinkSync(dir + "/" + file, () => {});
          }
        }
        res.status(200).send({ message: "member deleted successfully!" });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "member not found",
          });
        }
        return res.status(500).send({
          message: "Could not delete member",
        });
      });
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
          message: "member not found",
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "member not found",
        });
      }
      return res.status(500).send({
        message: "Error updating accepted ",
      });
    });
};

exports.getAllImagesLinksOfUsers = (req, res, next) => {
  let result = [];
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let files = fs.readdirSync(dir);
  let tableOfId = [];
  files.forEach((element) => {
    tableOfId.push(element.split(".")[0]);
    result.push({
      _id: element.split(".")[0],
      urlImage:
        `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +
        "/api/user/app/images/" +
        element,
    });
  });
  User.find({ accepted: true, confirm: true, _id: { $nin: tableOfId } })
    .select({ _id: 1, urlImage: 1 })
    .then((users) => {
      users.forEach((element) => {
        if (element.urlImage) {
          let data = element.urlImage;
          let buff = Buffer.from(data.split(";base64,")[1], "base64");
          let extension = data.split(";base64,")[0].split("/")[1];
          let fileName = dir + "/" + element._id + "." + extension;
          fs.writeFileSync(fileName, buff);
          const file = element._id + "." + extension;
          result.push({
            _id: element._id,
            urlImage:
              `${
                process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"
              }` +
              "/api/user/app/images/" +
              file,
          });
        } else {
          result.push({
            _id: element._id,
            urlImage: "",
          });
        }
      });
      return res.status(200).json(result);
    })
    .catch((error) => res.status(400).json({ message: "Users not found" }));
};

exports.getImageByNom = (req, res) => {
  let nomImage = req.params.nomImage;
  let files = fs.readdirSync(dir);
  if (!files.includes(nomImage)) {
    return res.status(404).json({ message: "Image n'existe pas!!" });
  }
  return res.sendFile(directory + "/" + dir + "/" + nomImage);
};

exports.createImagesOfUsers = () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let files = fs.readdirSync(dir);
  let tableOfId = [];
  files.forEach((element) => {
    tableOfId.push(element.split(".")[0]);
  });
  User.find({ accepted: true, confirm: true, _id: { $nin: tableOfId } })
    .select({ _id: 1, urlImage: 1 })
    .then((users) => {
      users.forEach((element) => {
        if (element.urlImage) {
          let data = element.urlImage;
          let buff = Buffer.from(data.split(";base64,")[1], "base64");
          let extension = data.split(";base64,")[0].split("/")[1];
          let fileName = dir + "/" + element._id + "." + extension;
          fs.writeFileSync(fileName, buff);
        }
      });
    });
};

function getImageFromDossierImagesAndCreateItIfNotExist(id, base64) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let files = fs.readdirSync(dir);
  let file;
  let urlImage;
  if (files.find((el) => el.indexOf(id) !== -1)) {
    file = files.find((el) => el.indexOf(id) !== -1);
    urlImage =
      `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +
      "/api/user/app/images/" +
      file;
  } else {
    if (base64) {
      let buff = Buffer.from(base64.split(";base64,")[1], "base64");
      let extension = base64.split(";base64,")[0].split("/")[1];
      let fileName = dir + "/" + id + "." + extension;
      fs.writeFileSync(fileName, buff);
      file = id + "." + extension;
      urlImage =
        `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +
        "/api/user/app/images/" +
        file;
    } else {
      urlImage = "";
    }
  }

  return urlImage;
}
exports.getImageFromDossierImagesAndCreateItIfNotExist=(id,base64)=>getImageFromDossierImagesAndCreateItIfNotExist(id,base64);
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
    User.findById(idUser).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
      banni:1,accepted:1 ,renewal:1 ,role:1 })
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
    User.findById(idUser).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
      banni:1,accepted:1 ,renewal:1 ,role:1 })
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
  User.findById(req.params.id).select({ firstName: 1, lastName: 1, email:1,adress:1, tel:1,dateOfBirth:1,banni:1,
    confirm:1,role:1,renewal:1 ,createdAt:1 ,updatedAt:1 })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Utilisateur non trouvé",
        });
      }
      user.urlImage=getImageFromDossierImagesAndCreateItIfNotExist(req.params.id,"");
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
        user.urlImage = req.body.newurlImage;
        user.save()
        .then(() => {
          if (fs.existsSync(dir)) {
            let files = fs.readdirSync(dir);
            if (files.find((el) => el.indexOf(user._id) !== -1)) {
              let fileT = files.find((el) => el.indexOf(user._id) !== -1);
              fs.unlinkSync(dir + "/" + fileT, () => {});
            }
          }
          let urlImage = "";
          if (req.body.newurlImage) {
            let buff = Buffer.from(user.urlImage.split(";base64,")[1], "base64");
            let extension = user.urlImage.split(";base64,")[0].split("/")[1];
            let fileName = dir + "/" + user._id + "." + extension;
            fs.writeFileSync(fileName, buff);
            let file = user._id + "." + extension;
            urlImage =
              `${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +
              "/api/user/app/images/" +
              file;
          }
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


exports.getMembreWithoutPhoto = (req, res) => {
  User.findById(req.params.id).select({ email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Member not found ",
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Member not found ",
        });
      }
      return res.status(500).send({
        message: "Error retrieving member details",
      });
    });
};