const express = require("express");
const router = express.Router();
const { create, edit, remove, fetchAll } = require('../controllers/contactController')
const { validate } = require('../middlewares/validator')
const { createContactSchema } = require('../helpers/joi-schema')
const {isLogin} = require('../middlewares/auth')


router.post("/create", isLogin, validate(createContactSchema), create);
router.put("/edit/:id", isLogin, validate(createContactSchema), edit);
router.delete("/delete/:id", isLogin, remove);
router.get("/",isLogin ,fetchAll)

module.exports = router