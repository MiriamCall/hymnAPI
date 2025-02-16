const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const validateHymn = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("number")
    .isInt({ min: 1 })
    .withMessage("number must be a positive integer"),

  body("lyrics")
    .isString()
    .withMessage("Lyrics must be a string")
    .notEmpty()
    .withMessage("Lyrics cannot be empty"),

  body("composer").isString().withMessage("Composer must be a string"),

  body("topics")
    .isArray()
    .withMessage("Topics must be an array")
    .custom((topics) => topics.every((topic) => typeof topic === "string"))
    .withMessage("Each topic must be a string"),

  body("scriptures")
    .optional()
    .isString()
    .withMessage("Scriptures must be a string"),

  body("webURL").optional().isURL().withMessage("webURL must be a valid URL"),
];

const validateUser = [
  body("firstName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name is required"),

  body("lastName")
    .isString()
    .withMessage("Last name must be a string")
    .notEmpty()
    .withMessage("Last name is required"),

  body("favorites")
    .isArray()
    .withMessage("Favorites must be an array")
    .custom((favorites) => favorites.every((num) => Number.isInteger(num)))
    .withMessage("Each number in the favorites array must be a integer"),
];

const validateId = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid ID format");
    }
    return true;
  }),
];

module.exports = { validateHymn, validateUser, validateId };
