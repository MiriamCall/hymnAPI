const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

if (process.env.NODE_ENV === "development") {
  swaggerDocument.host = "localhost:8080";
  swaggerDocument.schemes = ["http"];
}

// Swagger UI Route
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

module.exports = router;
