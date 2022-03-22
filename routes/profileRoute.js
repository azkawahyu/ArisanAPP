const express = require("express");
const router = express.Router();
const { fetchAccountInfo, uploadImage, editProfile, changePassword} = require('../controllers/profileController')
const { validate } = require('../middlewares/validator')
const { editProfileSchema, editPasswordSchema } = require('../helpers/joi-schema')
const { isLogin } = require('../middlewares/auth')
const { uploadCloud } = require('../middlewares/uploadImage')


router.get("/", isLogin, fetchAccountInfo);
router.post("/upload", isLogin, uploadCloud('image'), uploadImage);
router.put('/edit', isLogin, validate(editProfileSchema), editProfile)
router.put('/password', isLogin, validate(editPasswordSchema), changePassword)





module.exports = router