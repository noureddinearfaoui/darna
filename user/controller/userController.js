const User = require ('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const email = require('../../config/email')

require('dotenv').config()

exports.signup = (req, res, next) => {

     let email= 'noureddine0arfaouiee';
     let password= '123456';
  bcrypt.hash(password, 10)
    .then(hash => {
      const user = new User({
        email: email,
        password: hash,
        role:'user'
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
  
  exports.login = (req, res, next) => {
    let email= 'noureddine0arfaouiee';
     let password= '123456';
    User.findOne({ email: email  })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.RANDOM_TOKEN_SECRET,
              { expiresIn: '24h' }
            )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.finduser= (req, res, next) => {
    User.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  }
  exports.test= (req, res, next) => {


    
   res.json("aloo" )
  }
  exports.test2= (req, res, next) => {
    let id=5;

    const message = {
      from: 'elonmusk@tesla.com', // Sender address
      to: 'to@email.com',         // List of recipients
      subject: 'Design Your Model S | Tesla', // Subject line
      html: `<a href="http://localhost:3000/api/user/test2/${id}">sss</a>`
      // Plain text body
  };

  email.send(message);

  next();
    

    

  }