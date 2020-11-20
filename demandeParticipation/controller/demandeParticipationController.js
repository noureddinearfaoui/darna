const DemandeParticipation = require("../model/demandeParticipation")
const User = require("../../user/model/user")
const Action = require("../../action/model/action")
exports.addDemande = (req, res, next) => {

  

    let idUser= req.params.idUser; 

    let idAction= req.params.idAction;
    User.findById(idUser)
    .then(user=>{
       

        


        Action.findById(idAction)
        .then(action=>{
           
            
            const demande = new DemandeParticipation({
                status:"attente",
                participated:false,
                member:user,
               action:action
            })
           
            demande.save()
                   .then(()=>res.status(200).json({ demande }))
                    .catch((error) => res.status(500).json({ message : "error server"+error }));;
            
        
         
        })
        .catch((error) => res.status(500).json({ message:"action Non trouvé" }));
     
    })
    .catch((error) => res.status(500).json({ message:"user Non trouvé" }));


    
}
