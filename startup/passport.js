const passport = require("../config/passport");
const router = require("../routes");
module.exports = function (app) {
//   // app.use(router);
//   // app.get(
//   //   "/api/v1/auth/google",
//   //   passport.authenticate("google", { scope: ["profile", "email"] })
//   // );
//   // app.get(
//   //   "/api/v1/auth/google/callback",
//   //   passport.authenticate("google", { failureRedirect: "/api/v1/auth/google" }),
//   //   (req, res) => {
//   //     console.log(req.user._json);
//   //     res.redirect("/user");
//   //   }
//   // );
  app.use(passport.initialize());
};
