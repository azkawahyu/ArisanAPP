const express = require("express");
const router = express.Router();
const {
  createArisan,
  getArisans,
  getArisan,
  updateArisan,
  deleteArisan,
  filterArisan,
  searchArisan,
  startRaffle,
  fetchHistory,
  sortArisanByMemory,
} = require("../controllers/arisanController");
const { validate } = require("../middlewares/validator");
const {
  createArisanSchema,
  updateArisanSchema,
} = require("../helpers/joi-schema");
const { isLogin } = require("../middlewares/auth");
const lotterystats = require("../middlewares/lottery");

router.post("/", isLogin, validate(createArisanSchema), createArisan);
router.get("/search", isLogin, searchArisan);
router.get("/filter", isLogin, filterArisan);
router.get("/", isLogin, getArisans);
router.get("/:arisanId", isLogin, lotterystats, getArisan);
router.put("/:arisanId", isLogin, validate(updateArisanSchema), updateArisan);
router.delete("/:arisanId", isLogin, deleteArisan);
router.get("/raffle/:arisanId", isLogin, startRaffle);
router.get("/history/:arisanId", isLogin, fetchHistory);
router.get("/sort/memory", isLogin, sortArisanByMemory);

module.exports = router;
