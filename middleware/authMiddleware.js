const User = require("../models/user");
const { createUser } = require("../controllers/userControllers"); // Import the createUser controller

// Middleware to check if the user is authenticated
const checkAuth = async (req, res, next) => {
  // If the user is not authenticated, return an error
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  // User is authenticated, proceed to the next middleware or route handler
  next();
};

// Middleware to check if the user exists in the database or create them
const checkUser = async (req, res, next) => {
  try {
    // Extract the Auth0 user ID and user details
    const { sub, given_name, family_name } = req.oidc.user;

    // Check if the user exists in the database by Auth0 ID (sub)
    let user = await User.findOne({ auth0Id: sub });

    if (!user) {
      // If user doesn't exist, check if firstName and lastName are available
      if (!given_name || !family_name) {
        return res.status(400).json({
          message:
            "User profile incomplete. Missing first name or last name from Auth0.",
        });
      }

      // Set user details in the request body
      req.body.firstName = given_name;
      req.body.lastName = family_name;
      req.body.auth0Id = sub; // Include the Auth0 user ID in the body

      // Call the createUser controller to handle user creation
      return createUser(req, res, next);
    }

    // If user exists, attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking/creating user:", error.message);
    res.status(500).json({ message: "Error checking or creating user" });
  }
};

module.exports = { checkAuth, checkUser };
