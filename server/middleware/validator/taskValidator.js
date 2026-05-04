const { body } = require("express-validator");

exports.createTaskValidation = [
  body("title")
    .notEmpty().withMessage("Title is required"),

  body("projectId")
    .notEmpty().withMessage("Project ID required"),

  body("assignedTo")
    .notEmpty().withMessage("Assigned user required"),

  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority")
];

exports.updateTaskValidation = [
  body("status")
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Invalid status")
];