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

// Create a new user controller function (using OAuth data)
const createUser = async (req, res) => {
  // Extract Auth0 OAuth data from the request (req.user)
  const { sub, given_name, family_name } = req.user;

  // Check if the user already exists based on the Auth0 ID
  let user = await User.findOne({ auth0Id: sub });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // If the user doesn't exist, create a new user
  user = new User({
    auth0Id: sub, // Use the Auth0 ID as a unique identifier
    firstName: given_name || "Unknown", // Default to "Unknown" if no first name is available
    lastName: family_name || "User", // Default to "User" if no last name is available
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
