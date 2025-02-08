const router = require("express").Router();

const userControllers = require("../controllers/userControllers");

// GET all users request
router.get("/", userControllers.getAllUsers);

// GET a single user request
router.get("/:id", userControllers.getSingleUser);

// POST request to create a new user
router.post("/", userControllers.createUser);

// PUT request to update a user
router.put("/:id", userControllers.updateUser);

// DELETE request to delete a user
router.delete("/:id", userControllers.deleteUser);

module.exports = router;
