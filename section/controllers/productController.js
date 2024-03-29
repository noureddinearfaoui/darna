const Product = require("../models/product");
const dir = "uploads/products";
const manageFiles = require("../../config/manageFiles");
require("dotenv").config();

exports.addProduct = (req, res, next) => {
  const product = new Product({
      name: req.body.name,
      price: req.body.price,
      });
      product
        .save()
        .then((p) => {
          if (req.body.picture) {
            if (req.body.picture.indexOf("base64")!==-1) {
            let picture=manageFiles.createFile(dir,req.body.picture,p._id,
              "/api/product/app/images/");
            p.picture=picture;
            }
            else{
              p.picture=req.body.picture;
            }
          }
            p.save().then((resultat)=>{
              res.status(200).json(resultat);
            }).catch((error) =>
              res.status(500).json({ message: error })
            );   
        })
        .catch((error) =>
          res.status(500).json({ message: error })
        );
   
};

exports.updateProduct = (req, res) => {
  const idProduct = req.params.id;
  Product.findById(idProduct)
  .then((product) => {
    if(req.body.name){
      product.name = req.body.name;
    }
    if(req.body.price){
      product.price = req.body.price;
    }
    if(req.body.picture){
      if (req.body.picture.indexOf("base64")!==-1) {
      
      let picture=manageFiles.createFile(dir,req.body.picture,product._id,
        "/api/product/app/images/");
      product.picture=picture;
      }
      else{
        product.picture=req.body.picture;
      }
    }
      product.save().then((resultat)=>{
        res.status(200).json(resultat);
      }).catch((error) =>
        res.status(500).json({ message: error })
      );
      
  })
  .catch((error) =>
    res.status(404).json({ message: "Produit non trouvé" })
  );
};

exports.deleteProduct = (req, res) => {
  const idProduct = req.params.id;
    Product.findById(idProduct)
      .then((product) => {
        product
          .remove()
          .then(() =>{ 
            manageFiles.deleteFile(dir,idProduct);
            res.status(200).json({message:"Produit supprimé avec succès"});
          })
          .catch((error) =>
            res.status(500).json({ message: "Erreur serveur" + error })
          );
      })
      .catch((error) =>
        res.status(404).json({ message: "Produit non trouvé" })
      );
};


exports.getAllProducts = (req, res, next) => {
    Product.find()
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((error) => res.status(404).json({ message: "Erreur pendant la récupération des produits" }));
  };


exports.getProductDetails = (req, res) => {
    Product.findById(req.params.id)
      .then((product) => {
        res.send(product);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Produit non trouvé",
          });
        }
        return res.status(500).send({
          message: "Erreur serveur",
        });
      });
  };

exports.getImageByNom = (req, res) => {
  let urlImage=manageFiles.getFileByNom(dir,req.params.nomImage);
  if (!urlImage) {
    return res.status(404).json({ message: "Image n'existe pas!!" });
  }
  return res.sendFile(urlImage);
};