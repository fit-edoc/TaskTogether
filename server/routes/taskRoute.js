const router = require("express").Router();
const { createTask, updateTask } = require("../controller/taskController");
const auth = require("../middleware/authmiddleware");

router.post("/createTask", auth, createTask);
router.patch("/:id", auth, updateTask);

module.exports = router;    