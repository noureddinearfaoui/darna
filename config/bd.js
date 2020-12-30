const mongoose = require("mongoose");
const userCtrl = require("../user/controller/userController");
require("dotenv").config();

exports.connectMongodb = mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //userCtrl.createImagesOfUsers();
    console.log("Connexion à MongoDB réussie !");
    
  })
  .catch(() => console.log("Connexion à MongoDB échouée !"));
