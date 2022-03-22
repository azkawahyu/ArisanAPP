const express = require("express");
const router = express.Router();
const { create, edit, remove, filter, fetchAll, sort } = require('../controllers/participantController')
const { isLogin } = require('../middlewares/auth')


router.post("/create/:arisanId", isLogin, create);
router.put("/edit/:participantId", isLogin, edit);
router.delete("/delete/:participantId", isLogin, remove);
router.get("/filter/:arisanId", isLogin, filter);
router.get("/:arisanId", isLogin, fetchAll);
router.get("/sort/:arisanId", isLogin, sort);


module.exports = router