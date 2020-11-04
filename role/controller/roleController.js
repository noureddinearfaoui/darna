const Role = require('../model/role')


exports.test=((req,res,next)=>{
     let roleName = 'membre'   
    const role = new Role({
        roleName: roleName,
        });
      role.save()
        .then(() => res.status(201).json({ message: 'role créé !' }))
        .catch(error => res.status(400).json({ error }));
})
