const { body } = require("express-validator");

const validationRegister = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address.")
    .notEmpty()
    .withMessage("Email is required."),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password is required."),
  // .isLength({ min: 6 })
  // .withMessage("Password must be at least 6 characters long."),
];

const validationLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address.")
    .notEmpty()
    .withMessage("Email is required."),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password is required."),
  // .isLength({ min: 6 })
  // .withMessage("Password must be at least 6 characters long."),
];

module.exports = { validationRegister, validationLogin };
