
const User = require('../../user/model/user');

module.exports= (...permittedRoles)=> {
  // return a middleware

  
  return (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    const userId = decodedToken.userId;
       try{
       User.findById(userId).populate('roles')
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
      catch (error) {
        res.status(401).json({
          error: error
        });
      }
  }
}