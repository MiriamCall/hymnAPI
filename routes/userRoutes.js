const router = require("express").Router();
const { handleValidationErrors, handleErrors } = require("../utils");
const { validateUser, validateId } = require("../middleware/validators");

const userControllers = require("../controllers/userControllers");

// GET all users request
router.get("/", handleErrors(userControllers.getAllUsers));

// GET a single user request
router.get(
  "/:id",
  validateId,
  handleValidationErrors,
  handleErrors(userControllers.getSingleUser)
);

// POST request to create a new user
router.post(
  "/",
  validateUser,
  handleValidationErrors,
  handleErrors(userControllers.createUser)
);

// PUT request to update a user
router.put(
  "/:id",
  validateId,
  validateUser,
  handleValidationErrors,
  handleErrors(userControllers.updateUser)
);

// DELETE request to delete a user
router.delete(
  "/:id",
  validateId,
  handleValidationErrors,
  handleErrors(userControllers.deleteUser)
);

module.exports = router;
