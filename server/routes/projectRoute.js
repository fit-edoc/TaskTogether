const router = require("express").Router();
const { createProject, addMember } = require("../controller/projectContoller");
const auth = require("../middleware/authmiddleware");
const { checkRole } = require("../middleware/rolemiddleware");

router.post("/create", auth, createProject);
router.post("/:projectId/member", auth, checkRole("admin"), addMember);

module.exports = router;