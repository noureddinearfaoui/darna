const mongoose = require("mongoose");
require("dotenv").config();

exports.connectMongodb = mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion à MongoDB réussie !");
    
  })
  .catch(() => console.log("Connexion à MongoDB échouée !"));
