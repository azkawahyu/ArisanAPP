const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const {
  googleCallback,
  facebookCallback,
} = require("../controllers/authController");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/auth/google" }),
  googleCallback
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/api/v1/auth/facebook",
  }),
  facebookCallback
);
module.exports = router;
