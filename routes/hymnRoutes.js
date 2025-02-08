const router = require("express").Router();

const hymnControllers = require("../controllers/hymnControllers");

// GET all hymns request
router.get("/", hymnControllers.getAllHymns);

// GET a single hymn request
router.get("/:id", hymnControllers.getSingleHymn);

// POST request to create a new hymn
router.post("/", hymnControllers.createHymn);

// PUT request to update a hymn
router.put("/:id", hymnControllers.updateHymn);

// DELETE request to delete a hymn
router.delete("/:id", hymnControllers.deleteHymn);

module.exports = router;
