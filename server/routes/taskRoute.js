const router = require("express").Router();
const { createTask, updateTask,deleteTask,getTasks } = require("../controller/taskController");
const auth = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/rolemiddleware")
router.post("/createTask", auth, createTask);
router.patch("/update-task/:id", auth, updateTask);
router.delete("/delete-task/:id", auth, checkRole("admin"), deleteTask);
router.get("/get-task", auth, getTasks);

module.exports = router;  