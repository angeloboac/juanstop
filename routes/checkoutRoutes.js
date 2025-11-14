const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

// CREATE
router.post("/", checkoutController.createCheckout);

// GET ALL
router.get("/", checkoutController.getAllCheckouts);

// GET BY ID
router.get("/:id", checkoutController.getCheckoutById);

// UPDATE
router.put("/:id", checkoutController.updateCheckout);

// DELETE
router.delete("/:id", checkoutController.deleteCheckout);

//Get sales with pagination
router.get("/sales/paginated", checkoutController.getSales);
module.exports = router;
