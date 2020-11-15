const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const password = require("secure-random-password");
const Role = require("../../role/model/role");
const user = require("../model/user");
const email = require("../../config/email");
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
      user.confirm = false;
      user.accepted = false;
      user.banni = false;
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
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
            console.log("aaaaaaaaaaa");
            const message = {
              from: "hanzouliarfaoui@gmail.com", // Sender address
              to: user.email, // List of recipients
              subject: "Confirmer votre compte", // Subject line
              html: `<p>Bonjour ${user.firstName} ${user.lastName}
                           pour confirmer votre compte utilisez ce lien
                        <a href="http://localhost:3000/api/user/confirm/${user._id}">sss</a></p>`,
              // Plain text body
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

            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id, role: user.role },
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
      if (user.confirm) res.status(301).json({ message: "Confirmed! deja" });
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
  bcrypt.hash(password.randomPassword(), 10).then((hash) => {
    const user = new User({
      ...req.body,
    });
    user.password = hash;
    user.confirm = false;
    user.accepted = true;
    user.banni = false;
    user.renewal = [new Date()];
    user
      .save()
      .then(() => {
        const message = {
          from: "hanzouliarfaoui@gmail.com", // Sender address
          to: user.email, // List of recipients
          subject: "Confirmer votre compte", // Subject line
          html: `<p>Bonjour ${user.firstName} ${user.lastName}
                       pour confirmer votre compte utilisez ce lien
                    <a href="http://localhost:3000/api/user/confirm/${user._id}">sss</a></p>`,
          // Plain text body
        };
        email.send(message);
        res.status(201).json({
          message: "member added successfully",
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  });
  console.log("pppp", password.randomPassword());
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

// accepted true
exports.getAcceptedMembers = (req, res) => {
  User.find(
    { accepted: "true", confirm: "true", role: "membre" },
    (err, users) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      return res.status(200).json(users);
    }
  ).catch((err) => console.log(err));
};

//accepted false & confirm true
exports.getDemandes = (req, res) => {
  User.find({ accepted: "false", role: "membre" }, (err, users) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.status(200).json(users);
  }).catch((err) => console.log(err));
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
  User.findById(userId)
    .then((user) => {
      console.log(user);
      user.renewal.push(date);
      user.save();
      res.status(200).json({
        message: "Success",
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

  User.findById(userId)
    .then((user) => {
      res.status(200).json(user.renewal);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong, please try again later." + err,
      });
    });
};
// delete member by id
exports.deleteOneMember = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Member not found",
        });
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
