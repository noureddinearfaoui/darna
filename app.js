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
const helpRoutes= require("./section/helpRoutes");
const homeRoutes=require("./section/homeRoutes");
const sponsorRoutes=require("./section/sponsorRoutes")
const productRoutes=require("./section/productRoutes")
const docLinkRoutes=require("./section/docLinkRoutes")
const donationRoutes=require("./section/donationRoutes")
const projectRoutes=require("./section/projectRoutes");
const contactRoutes=require("./section/contactRoutes");
const NotificationRoutes = require("./notification/routes");
const staffRoutes=require("./section/staffRoutes")
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
app.use("/api/notification", NotificationRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/sponsor", sponsorRoutes);
app.use("/api/product", productRoutes);
app.use("/api/docLink", docLinkRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/donation",donationRoutes)
app.use("/api/contact",contactRoutes);
app.use("/api/staff",staffRoutes);
module.exports = app;
