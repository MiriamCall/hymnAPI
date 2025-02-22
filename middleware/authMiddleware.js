const User = require("../models/user");
const { createUser } = require("../controllers/userControllers");

// Authentication middleware to protect routes
// Ensures users are logged in before accessing protected endpoints
const checkAuth = async (req, res, next) => {
  try {
    // Verify Auth0 middleware initialization
    if (!req.oidc) {
      return res.status(500).json({
        message: "Authentication middleware not properly initialized",
      });
    }

    // Validate user authentication status
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    // Authentication successful - proceed to next middleware
    next();
  } catch (error) {
    console.error("Authentication check error:", error);
    return res.status(500).json({
      message: "Error checking authentication status",
    });
  }
};

// User management middleware
// Checks for user existence in database and creates new users if needed
// Uses Auth0 profile data for user creation
const checkUser = async (req, res, next) => {
  try {
    // Validate Auth0 user data availability
    if (!req.oidc || !req.oidc.user) {
      return res.status(400).json({
        message: "User information not available",
      });
    }

    const { sub, given_name, family_name } = req.oidc.user;

    // Validate Auth0 ID presence
    if (!sub) {
      return res.status(400).json({
        message: "Missing Auth0 user ID (sub)",
      });
    }

    // Check for existing user in database
    let user = await User.findOne({ auth0Id: sub });

    if (!user) {
      // Validate required profile information
      if (!given_name || !family_name) {
        return res.status(400).json({
          message:
            "User profile incomplete. Missing first name or last name from Auth0.",
        });
      }

      const result = await createUser(req, res);

      if (res.headersSent) {
        return;
      }

      // Validate user creation result
      if (result && result.user) {
        user = result.user;
      } else {
        return res.status(500).json({
          message: "Failed to create user",
        });
      }
    }

    // Attach user data to request for route handlers
    req.user = user;

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
