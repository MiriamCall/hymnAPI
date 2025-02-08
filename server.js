const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
require("dotenv").config();
const connectToDatabase = require("./db/db_connect");

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
