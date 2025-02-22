const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
require("dotenv").config();
const connectToDatabase = require("./db/db_connect");
const { auth } = require("express-openid-connect");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectToDatabase()
  .then(() => {
    console.log("Database connected successfully.");

    // Routes
    app.use("/", require("./routes"));

    // Error Handling Middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "An error occurred. Please try again later.",
      });
    });

    // Auth0 Configuration
    const config = {
      authRequired: false,
      auth0Logout: true,
      secret: process.env.AUTH0_SECRET,
      baseURL: process.env.BASE_URL,
      clientID: process.env.AUTH0_CLIENT_ID,
      issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    };

    // Attach Auth0 authentication routes
    app.use(auth(config));

    // req.isAuthenticated is provided from the auth router
    app.get("/", (req, res) => {
      res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
    });

    // Server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`>> http://localhost:${PORT}`);
        console.log(`>> http://localhost:${PORT}/api-docs\n`);
      }
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
