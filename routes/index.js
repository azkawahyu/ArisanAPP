const express = require("express");
const router = express.Router();
const signRoute = require("./signRoute");
const arisanRoute = require("./arisanRoute");
const contactRoute = require("./contactRoute");
const profileRoute = require("./profileRoute");
const participantRoute = require("./participantRoute");
const authRoute = require("./authRoute");

router.use("/arisan", arisanRoute);
router.use("/sign", signRoute);
router.use("/contact", contactRoute);
router.use("/profile", profileRoute);
router.use("/participant", participantRoute);
router.use("/auth", authRoute);

module.exports = router;
