const router = require("express").Router();
const { createProject, addMember,removeMember,getProjects } = require("../controller/projectContoller");
const auth = require("../middleware/authmiddleware");
const { checkRole, checkGlobalAdmin } = require("../middleware/rolemiddleware");
const { createProjectValidation } = require("../middleware/validator/projectValidator");
const validate = require("../middleware/validateMiddleware");

router.post("/create-project",createProjectValidation,validate, auth, checkGlobalAdmin, createProject);
router.post("/:projectId/add-member", auth, checkRole("admin"), addMember);
router.delete("/:projectId/remove-member/:userId", auth,checkRole("admin"),removeMember);
router.get("/", auth, getProjects);


module.exports = router;