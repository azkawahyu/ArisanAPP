const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/signController");
const { validate } = require("../middlewares/validator");
const { registerSchema, loginSchema } = require("../helpers/joi-schema");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
