const Action = require("../model/action")
const User = require("../../user/model/user")

exports.addAction = (req, res, next) => {

    let idUser= "5fb3fa9db13c700fba0416d2"; 


    User.findById(idUser)
    .then(user=>{
        let  a = { NomAction:"neewaction" ,
        description: "joli action",
        lieu: "manouba",
        dateDebut:"06/09/2020",
        dateFin:"06/09/2020" ,
        dateDebutIndcription: "06/09/2020",
        dateFinIndcription: "06/09/2020",
        nbrMembres: 12,
        estPublie: false,
        user: user
        }   
        console.log(user)      
    const action = new Action({
        ...a
    })

     action.save()
     .then(()=>res.status(200).json({ action }))
     .catch((error) => res.status(500).json({ message : "error server"+error }));;
     
    })
    .catch((error) => res.status(500).json({ message:"user Non trouvé" }));





}