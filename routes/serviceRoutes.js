const express = require("express");
const router = express.Router();
const multer = require("multer");
const serviceController = require("../controllers/serviceController");

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.post("/register", upload.single("image"), serviceController.createService);
router.put("/edit/:id", upload.single("image"), serviceController.updateService);
router.delete("/delete/:id", serviceController.deleteService);

module.exports = router;
