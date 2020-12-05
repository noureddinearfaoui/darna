// import system
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/bd");

// import métier
const userRoutes = require("./user/routes");
const roleRoutes = require("./role/routes");
const ActionRouts = require("./action/routes");
const DemandeParticipationRoutes = require("./demandeParticipation/routes");
const CommentRoutes = require("./comment/routes");
var cors = require("cors");
//connexion base de donneés
config.connectMongodb;
const app = express();
app.use(cors());
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

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

//middleware user
app.use("/api/user", userRoutes);

app.use("/api/action", ActionRouts);
app.use("/api/demandeParticipation", DemandeParticipationRoutes);
app.use("/api/Comment", CommentRoutes);

module.exports = app;
