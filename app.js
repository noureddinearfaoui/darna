// import system
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import métier
const userRoutes = require('./user/routes');



//connexion base de donneés
let url = 'mongodb+srv://jimbob:<PASSWORD>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
// Cross Origin Resource Sharing(pour éviter CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

//middleware user
app.use('/api/user', userRoutes);



module.exports = app;