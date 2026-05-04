const express = require("express");
const { register, login, getAllUsers } = require("../controller/authController");
const { registerValidation,loginValidation } = require("../middleware/validator/authValidator");
const validate = require("../middleware/validateMiddleware");
const auth = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/register",registerValidation,validate, register);
router.post("/login",loginValidation,validate, login);
router.get("/users", auth, getAllUsers);

module.exports = router;