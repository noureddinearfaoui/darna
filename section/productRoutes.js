const express = require("express");
const router = express.Router();
const ProductCtrl = require(".//controllers/productController");

router.post("/addProduct",ProductCtrl.addProduct);
router.get("/getAllProducts", ProductCtrl.getAllProducts);
router.get("/getProductDetails/:id",ProductCtrl.getProductDetails);
router.put("/updateProduct/:id",ProductCtrl.updateProduct);
router.delete("/deleteProduct/:id",ProductCtrl.deleteProduct);
router.get("/app/images/:nomImage", ProductCtrl.getImageByNom);


module.exports = router;
