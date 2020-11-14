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
            const message = {
              from: "elonmusk@tesla.com", // Sender address
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

exports.getUserDetails = (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

exports.updateUserDetails = (req, res) => {
  let userId = req.params.id;

  User.findByIdAndUpdate({ _id: userId }, { $set: req.body }, (err, data) => {
    if (err) {
      res.status(500).json({
        message: "Something went wrong, please try again later.",
      });
    } else {
      res.status(200).json({
        message: "User Updated",
        data,
      });
    }
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
    user.renewal = false;
    //user.roles.push(role);
    user
      .save()
      .then(() => {
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
      return res.status(404).json({ success: false, error: `User not found` });
    }
    return res.status(200).json({ success: true, data: users });
  }).catch((err) => console.log(err));
};

// accepted true
exports.getAcceptedMembers = (req, res) => {
  User.find(
    { accepted: "true", confirm: "true", role: "membre" },
    (err, users) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!users.length) {
        return res
          .status(404)
          .json({ success: false, error: `User not found` });
      }
      return res.status(200).json({ success: true, data: users });
    }
  ).catch((err) => console.log(err));
};

//accepted false & confirm true
exports.getDemandes = (req, res) => {
  User.find(
    { accepted: "true", confirm: "false", role: "membre" },
    (err, users) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!users.length) {
        return res
          .status(404)
          .json({ success: false, error: `User not found` });
      }
      return res.status(200).json({ success: true, data: users });
    }
  ).catch((err) => console.log(err));
};

exports.update = (req, res) => {
  let userId = req.body.idMembre;
  let banniNewVal = req.body.bani;
  User.findByIdAndUpdate(userId, { banni: banniNewVal }, (err, data) => {
    if (err) {
      res.status(500).json({
        message: "Something went wrong, please try again later." + err,
      });
    } else {
      res.status(200).json({
        message: "User est banni",
      });
    }
  });
};
exports.NouveauAdhsion = (req, res) => {
  let userId = req.headers.userid;
  let date= req.body.date;
  console.log(userId);
  User.findById(userId)
  .then((user) => {
    console.log(user)
      user.renewal.push(date);
       user.save();
       res.status(200).json({
        message: "Success",
      });
        
  })
  .catch(err=>{

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
  .catch(err=>{

    res.status(500).json({
      message: "Something went wrong, please try again later." + err,
    });
  });
};