const Action = require("../model/action")
const User = require("../../user/model/user")

exports.addAction = (req, res, next) => {

    let idUser= req.headers.iduser ;
    

    User.findById(idUser)
    .then(user=>{
    if(user)
    { 
    const action = new Action({
        ...req.body
    })
    action. estPublie= false;
    action.user=user;

     action.save()
     .then(()=>res.status(200).json({ action }))
     .catch((error) => res.status(500).json({ message : "error server"+error }));;
   }
   else 
   res.status(500).json({ message:"user Non trouvé" })
    })
    .catch((error) => res.status(500).json({ message:"user Non trouvé" }));





}