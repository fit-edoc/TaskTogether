const express = require("express");
const { register, login } = require("../controller/authController");
const { registerValidation,loginValidation } = require("../middleware/validator/authValidator");
const validate = require("../middleware/validateMiddleware");
const router = express.Router();

router.post("/register",registerValidation,validate, register);
router.post("/login",loginValidation,validate, login);

module.exports = router;