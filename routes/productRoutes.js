const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", upload.single("image"), productController.register);
router.put("/edit/:id", upload.single("image"), productController.edit);
router.delete("/delete/:id", productController.delete);
router.get("/get/:id", productController.getProductById);
router.get("/all", productController.getAllProducts);
router.get("/", productController.getAllProductsFilter);

module.exports = router;
