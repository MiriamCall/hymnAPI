const router = require("express").Router();
const hymnRoutes = require("../routes/hymnRoutes");
const userRoutes = require("../routes/userRoutes");
const swaggerRoute = require("./swaggerRoutes");
const { checkAuth, checkUser } = require("../middleware/authMiddleware/js");

router.use(checkAuth);

router.use("/api/hymns", checkUser, hymnRoutes);
router.use("/api/users", checkUser, userRoutes);
router.use("/api-docs", checkUser, swaggerRoute);

module.exports = router;
