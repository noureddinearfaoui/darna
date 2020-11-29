const mongoose = require("mongoose");
const userCtrl = require("../user/controller/userController");
require("dotenv").config();

exports.connectMongodb = mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion à MongoDB réussie !");
    userCtrl.createImagesOfUsers();
  })
  .catch(() => console.log("Connexion à MongoDB échouée !"));
