const express = require("express");
const {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

// Order matters: more specific routes first
router.get("/", getUsers);                    // Get all users
router.get("/email/:email", getUserByEmail); // Get user by email
router.get("/:id", getUserById);             // Get user by ID
router.post("/", createUser);                // Create new user
router.put("/:idOrEmail", updateUser);       // Update user profile (ID or email)

module.exports = router;
