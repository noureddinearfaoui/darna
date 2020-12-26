const Product = require("../models/product");
const fs = require("fs");
const directory = require("../../pathDirectory");
const dirUploads = "uploads";
const dir = "uploads/products";
require("dotenv").config();

exports.addProduct = (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        });
        product
          .save()
          .then((p) => {
            if (!fs.existsSync(dirUploads)) {
                fs.mkdirSync(dirUploads);
            }
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            if (req.body.picture) {
              let data = req.body.picture;
              let buff = Buffer.from(data.split(";base64,")[1], "base64");
              let extension = data.split(";base64,")[0].split("/")[1];
              let fileName = dir + "/" + p._id + "." + extension;
              fs.writeFileSync(fileName, buff);
              picture =`${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +"/api/product/app/images/" +p._id + "." + extension;
              p.picture=picture;
              p.save().then((resultat)=>{
                res.status(200).json(resultat);
              }).catch((error) =>
                res.status(500).json({ message: error })
              );
            }else {
              res.status(200).json(p);
            }
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
        if (!fs.existsSync(dirUploads)) {
          fs.mkdirSync(dirUploads);
        }
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        let files = fs.readdirSync(dir);
        if (files.find((el) => el.indexOf(product._id) !== -1)) {
          let fileT = files.find((el) => el.indexOf(product._id) !== -1);
          fs.unlinkSync(dir + "/" + fileT, () => {});
        }
        let data = req.body.picture;
        let buff = Buffer.from(data.split(";base64,")[1], "base64");
        let extension = data.split(";base64,")[0].split("/")[1];
        let fileName = dir + "/" + product._id + "." + extension;
        fs.writeFileSync(fileName, buff);
        picture =`${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}` +"/api/product/app/images/" +product._id + "." + extension;
        product.picture=picture;
        product.save().then((resultat)=>{
          res.status(200).json(resultat);
        }).catch((error) =>
          res.status(500).json({ message: error })
        );
      }else{
        res.status(200).json(product);
      }      
    })
    .catch((error) =>
      res.status(404).json({ message: "Produit non trouvé" })
    );
  };

exports.deleteProduct = (req, res) => {
    const idProduct = req.params.id;
      Product.findById(idProduct)
        .then((product) => {
          if(fs.existsSync(dir)){
            let files = fs.readdirSync(dir);
            if (files.find((el) => el.indexOf(product._id) !== -1)) {
              let fileT = files.find((el) => el.indexOf(product._id) !== -1);
              fs.unlinkSync(dir + "/" + fileT, () => {});
            }
          }
          product
            .remove()
            .then(() =>{ 
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
  let nomImage = req.params.nomImage;
  let files = fs.readdirSync(dir);
  if (!files.includes(nomImage)) {
    return res.status(404).json({ message: "Image n'existe pas!!" });
  }
  return res.sendFile(directory + "/" + dir + "/" + nomImage);
};