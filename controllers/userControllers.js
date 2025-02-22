const mongoose = require("mongoose");
const User = require("../models/user");

// Get all users controller function
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user controller function
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user controller function
const createUser = async (req, res) => {
  try {
    // Extract Auth0 OAuth data from req.oidc.user instead of req.user
    if (!req.oidc || !req.oidc.user) {
      return res.status(400).json({ message: "Missing authentication data" });
    }

    const { sub, given_name, family_name } = req.oidc.user;

    // Validate required OAuth data
    if (!sub || !given_name || !family_name) {
      return res.status(400).json({
        message: "Missing required user data",
        details: {
          auth0Id: !sub ? "missing" : "present",
          firstName: !given_name ? "missing" : "present",
          lastName: !family_name ? "missing" : "present",
        },
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ auth0Id: sub });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      auth0Id: sub,
      firstName: given_name,
      lastName: family_name,
      favorites: [], // Initialize empty favorites array
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      details: error.message,
    });
  }
};

// Update a user controller function (with Auth0 ID-based lookup)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update the fields that are provided in the request
    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }
    if (req.body.favorites) {
      user.favorites = req.body.favorites;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user controller function
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
