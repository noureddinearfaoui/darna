const User = require ('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Role = require('../../role/model/role')

const email = require('../../config/email')

require('dotenv').config()

exports.signup = (req, res, next) => {

    
  bcrypt.hash(req.body.password, 10)
    .then(hash => {

        Role.findOne({ roleName: "membre"  })
        .then(role => {
             delete req.body._id;
             const user = new User({
              ...req.body
            });
            user.password=hash;
            user.confirm=false;
            user.accepted=false;
            user.banni=false;
            user.renewal=false
            user.roles.push(role);
            user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
              .catch(error => res.status(400).json({ error }));

            })
            .catch(error => res.status(500).json({ error }));
      
    })
    .catch(error => res.status(500).json({ error }));
};
  
  exports.login = (req, res, next) => {
   
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password,user.password)
          .then(valid => {
            
            
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }

            if(user.banni)
                  return res.status(401).json({ error: 'vous êtes banni !' });
             
            if(!user.confirm)
         {  
                
                  const message = {
                    from: 'elonmusk@tesla.com', // Sender address
                    to: user.email,         // List of recipients
                    subject: 'Confirmer votre compte', // Subject line
                     html: `<p>Bonjour ${user.firstName} ${user.lastName}
                           pour confirmer votre compte utilisez ce lien
                        <a href="http://localhost:3000/api/user/confirm/${user._id}">sss</a></p>`
                      // Plain text body
                  };
                  email.send(message);
                  return res.status(401).json({ error: 'vous devez confirmer votre compte !' });

                 
                   
        
                 
        
                 
        }       
             else{
              if(!user.accepted)
              return res.status(401).json({ error: 'vous n êtes pas encore accepter !' });
              if(!user.renewal)
              return res.status(401).json({ error:  'vous devez renouveler votre adhision !' });
                    res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                    { userId: user._id },
                    process.env.RANDOM_TOKEN_SECRET,
                   { expiresIn: '24h' }
                   )
                   });       
          }
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.confirmAccount= (req, res, next) => {
     
    
    User.findById(req.params.id)
    .then(user=>{
      if(user.confirm)
      res.status(301).json({ message: 'Confirmed! deja' })
      else
      {
         user.confirm=true;
         user.save()
         .then(() => res.status(200).json({ message: 'Confirmed!' }))
         .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
    
  }
  
  exports.test= (req, res, next) => {
    res.status(200).json({ message: 'test permession!' })
  }


