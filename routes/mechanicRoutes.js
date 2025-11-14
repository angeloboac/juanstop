const express = require("express");
const router = express.Router();
const mechanicController = require("../controllers/mechanicController");
const multer = require("multer");

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", mechanicController.getAllMechanics);
router.get("/:id", mechanicController.getMechanicById);
router.post("/register", upload.single("image"), mechanicController.createMechanic);
router.put("/edit/:id", upload.single("image"), mechanicController.updateMechanic);
router.delete("/delete/:id", mechanicController.deleteMechanic);
// SCHEDULE
router.get("/schedule/:id", mechanicController.getSchedule);
router.put("/schedule/:id", mechanicController.updateSchedule);
module.exports = router;
