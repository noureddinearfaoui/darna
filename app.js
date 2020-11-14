// import system
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/bd");

// import métier
const userRoutes = require("./user/routes");
const roleRoutes = require("./role/routes");

//connexion base de donneés
config.connectMongodb;

const app = express();
// Cross Origin Resource Sharing(pour éviter CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

//middleware user
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);
module.exports = app;
