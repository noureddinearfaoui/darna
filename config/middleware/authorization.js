
const User = require('../../user/model/user');

module.exports= (...permittedRoles)=> {
  // return a middleware

  
  return (req, res, next) => {
    
      
       
       User.findById(req.headers.userid).
       then(user=>{
          if (user && permittedRoles.includes(user.role)) {
               next(); // role is allowed, so continue on the next middleware
           } else {
           res.status(403).json({message: "authorization"}); // user is forbidden
         }
       })
       .catch(error=>
        {
          res.status(403).json({message: error});
        })
   
  }
}