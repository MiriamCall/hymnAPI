const router = require("express").Router();
const hymnRoutes = require("../routes/hymnRoutes");
const userRoutes = require("../routes/userRoutes");
const swaggerRoute = require("./swaggerRoutes");
const { checkAuth, checkUser } = require("../middleware/authMiddleware");

router.use("/api/hymns", checkAuth, checkUser, hymnRoutes);
router.use("/api/users", checkAuth, checkUser, userRoutes);
router.use("/api-docs", swaggerRoute);

module.exports = router;
