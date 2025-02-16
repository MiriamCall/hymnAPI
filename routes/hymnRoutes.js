const router = require("express").Router();

const { handleValidationErrors, handleErrors } = require("../utils");
const { validateHymn, validateId } = require("../middleware/validators");

const hymnControllers = require("../controllers/hymnControllers");

// GET all hymns request
router.get("/", handleErrors(hymnControllers.getAllHymns));

// GET a single hymn request
router.get(
  "/:id",
  validateId,
  handleValidationErrors,
  handleErrors(hymnControllers.getSingleHymn)
);

// POST request to create a new hymn
router.post(
  "/",
  validateHymn,
  handleValidationErrors,
  handleErrors(hymnControllers.createHymn)
);

// PUT request to update a hymn
router.put(
  "/:id",
  validateId,
  validateHymn,
  handleValidationErrors,
  handleErrors(hymnControllers.updateHymn)
);

// DELETE request to delete a hymn
router.delete(
  "/:id",
  validateId,
  handleValidationErrors,
  handleErrors(hymnControllers.deleteHymn)
);

module.exports = router;
