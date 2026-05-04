const { body } = require("express-validator");

exports.createProjectValidation = [
  body("name")
    .notEmpty().withMessage("Project name is required"),

  body("description")
    .notEmpty().withMessage("Description is required")
];

exports.addMemberValidation = [
  body("userId")
    .notEmpty().withMessage("User ID is required")
];