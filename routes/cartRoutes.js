const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
// Get cart items by user ID
router.get("/user/:userId", cartController.getCartByUser);

// Update cart item by ID
router.put("/edit/:id", cartController.updateCartItem);

// Delete cart item by ID
router.delete("/delete/:id", cartController.deleteCartItem);
module.exports = router;