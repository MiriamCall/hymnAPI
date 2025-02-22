const User = require("../models/user");
const { createUser } = require("../controllers/userControllers");

// Middleware to check if the user is authenticated
const checkAuth = async (req, res, next) => {
  try {
    // Check if req.oidc exists
    if (!req.oidc) {
      return res.status(500).json({
        message: "Authentication middleware not properly initialized",
      });
    }

    // If the user is not authenticated, return an error
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    // User is authenticated, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Authentication check error:", error);
    return res.status(500).json({
      message: "Error checking authentication status",
    });
  }
};

// Middleware to check if the user exists in the database or create them
const checkUser = async (req, res, next) => {
  try {
    // Verify req.oidc and req.oidc.user exist
    if (!req.oidc || !req.oidc.user) {
      return res.status(400).json({
        message: "User information not available",
      });
    }

    // Extract the Auth0 user ID and user details from req.oidc.user
    const { sub, given_name, family_name } = req.oidc.user;

    if (!sub) {
      return res.status(400).json({
        message: "Missing Auth0 user ID (sub)",
      });
    }

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

      // Create new user
      const result = await createUser(req, res);

      // If createUser sends a response, return early
      if (res.headersSent) {
        return;
      }

      // If createUser returns a user object, use it
      if (result && result.user) {
        user = result.user;
      } else {
        return res.status(500).json({
          message: "Failed to create user",
        });
      }
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return res.status(500).json({
      message: "Error checking or creating user",
      details: error.message,
    });
  }
};

module.exports = { checkAuth, checkUser };
