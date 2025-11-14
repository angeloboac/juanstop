const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/", appointmentController.getAllAppointments);
router.get("/user/:id", appointmentController.getUserAppointments);
router.post("/create", appointmentController.createAppointment);
router.put("/edit/:id", appointmentController.updateAppointment);
router.delete("/delete/:id", appointmentController.deleteAppointment);
router.get("/personal/:id", appointmentController.getUserPersonalAppointments);
module.exports = router;
