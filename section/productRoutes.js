const express = require("express");
const router = express.Router();
const ProductCtrl = require(".//controllers/productController");
const auth = require("../config/middleware/auth");
const permit = require("../config/middleware/authorization");
router.post("/addProduct", auth, permit("admin"),ProductCtrl.addProduct);
router.get("/getAllProducts", ProductCtrl.getAllProducts);
router.get("/getProductDetails/:id", auth, permit("admin"),ProductCtrl.getProductDetails);
router.put("/updateProduct/:id", auth, permit("admin"),ProductCtrl.updateProduct);
router.delete("/deleteProduct/:id", auth, permit("admin"),ProductCtrl.deleteProduct);
router.get("/app/images/:nomImage", ProductCtrl.getImageByNom);


module.exports = router;
