const router = require("express").Router();
const auth = require("../middleware/authmiddleware");
const { getDashboard } = require("../controller/dashboardController");

router.get("/", auth, getDashboard);

module.exports = router;