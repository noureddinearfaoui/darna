
const User = require('../../user/model/user');

module.exports= (...permittedRoles)=> {
  // return a middleware

  
  return (req, res, next) => {
    
      
       
       User.findById('5fa312ee997221157d37ddca').populate('roles')
       .then(user=>{
          if (user){
                        let roles = []; 
                        user.roles.forEach(element => roles.push(element.roleName));//récupération des roles de user concerné
                        console.log(roles)
                        console.log(permittedRoles)
         
                        if ( roles.some(r=> permittedRoles.includes(r))) {
                          next(); // role is allowed, so continue on the next middleware
                        } 
                        else {
                        res.status(403).json({message: "authorization"}); // user is forbidden
                        }
                    }
                    else {
                      res.status(403).json({message: "authorization"}); // user is forbidden
                      }
       })
       .catch(error=>
        {
          res.status(403).json({message: error});
        })
   
  }
}