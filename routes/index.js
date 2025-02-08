const router = require("express").Router();
const hymnRoutes = require("../routes/hymnRoutes");
const userRoutes = require("../routes/userRoutes");
const swaggerRoute = require("./swaggerRoutes");

router.use("/api/hymns", hymnRoutes);
router.use("/api/users", userRoutes);
router.use("/api-docs", swaggerRoute);

module.exports = router;
