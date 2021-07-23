const User = require("../model/user");
const bcrypt = require("bcrypt");
const email = require("../../config/email");
const crypto = require("crypto");
const passwordResetToken = require("../model/passwordResetToken");
require("dotenv").config();

exports.getToken = async (req, res) => {
  passwordResetToken.findOne(
    {
      resetToken: req.params.token,
      resetPasswordExpires: { $gte: Date.now() },
    },
    function (err, token) {
      console.log(token);
      if (!token) {
        return res.status(404).json({ message: "Token invalide ou expiré" });
      } else {
        res.status(200).json(token);
      }
    }
  );
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 });
  if (!user) {
    return res.status(404).json({ message: "Email inexistant" });
  }
  var resettoken = new passwordResetToken({
    _userId: user._id,
    resetToken: crypto.randomBytes(16).toString("hex"),
    resetPasswordExpires: Date.now() + 60000 * 15,
  });

  resettoken.save(function (err) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }

    const message = {
      from: process.env.EMAIL_USER, // Sender address
      to: user.email, // List of recipients
      subject: "Réinitialisation du mot de passe", // Subject line
      html: `<p>Bonjour,vous recevez ce message car vous avez demandé la réinitialisation du mot de passe de votre compte.<strong> <br>
                Pour réinitialiser votre mot de passe utilisez ce lien:
                <a href= "${
                  process.env.SERVER_FRONTEND_ADDRESS || "http://localhost:4200"
                }/pages/resetpassword/${
        resettoken.resetToken
      }">Réinitialiser</a></p>`,
    };
    email.send(message);
    return res.status(200).json({ message: "Email envoyé" });
  });
};

exports.resetPassword = async (req, res) => {
  const token = await passwordResetToken.findOne({
    resetToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!token) {
    return res.status(404).json({ message: "Token invalide ou expiré" });
  }
  const user = await User.findOne({
    _id: token._userId,
  }).select({ _id:1,email: 1, firstName: 1, lastName:1,adress:1, tel:1,dateOfBirth:1,confirm:1,
    banni:1,accepted:1 ,renewal:1 ,role:1 });

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  bcrypt.hash(req.body.newPassword, 10, (error, hash) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "Erreur de hashage du mot de passe" });
    }
    user.password = hash;
    user.save(function (err) {
      if (err) {
        return res
          .status(400)
          .json({ message: "Mot de passe non réinitialisé" });
      } else {
        token.remove();
        return res.status(201).json({ message: "Mot de passe réinitialisé" });
      }
    });
  });
};
