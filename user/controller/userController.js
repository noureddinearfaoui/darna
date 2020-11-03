const User = require ('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {

     let email= 'noureddine0arfaoui';
     let password= '123456';
  bcrypt.hash(password, 10)
    .then(hash => {
      const user = new User({
        email: email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
  
  exports.login = (req, res, next) => {
    let email= 'noureddine0arfaoui';
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
              'RANDOM_TOKEN_SECRET',
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