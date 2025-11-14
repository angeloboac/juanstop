const User = require("../model/User");
const mongoose = require("mongoose");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user ID." });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { username, password, contact, email } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser)
      return res.status(400).json({ message: "Email or username already exists." });

    const newUser = new User({ username, password, contact, email });
    await newUser.save();

    res.status(201).json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (accepts either ID or email)
const updateUser = async (req, res) => {
  try {
    const { idOrEmail } = req.params;
    const { username, contact, email } = req.body;

    let user;

    if (mongoose.Types.ObjectId.isValid(idOrEmail)) {
      // Update by ID
      user = await User.findById(idOrEmail);
    } else {
      // Update by email
      user = await User.findOne({ email: idOrEmail.replace("email/", "") });
    }

    if (!user) return res.status(404).json({ message: "User not found." });

    // Check for duplicate username/email
    const existingUser = await User.findOne({
      _id: { $ne: user._id },
      $or: [{ email }, { username }],
    });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or username already in use by another user." });

    // Update
    user.username = username;
    user.contact = contact;
    user.email = email;
    await user.save();

    res.json({ success: true, message: "Profile updated successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, getUserByEmail, createUser, updateUser };
