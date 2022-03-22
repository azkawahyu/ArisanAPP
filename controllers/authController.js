const { User } = require("../models");
const catchError = require("../utils/error");
const jwt = require("jsonwebtoken");

module.exports = {
  googleCallback: async (req, res) => {
    const userAuth = req.user._json;
    let user;
    try {
      user = await User.findOne({ where: { email: userAuth.email } });
      if (!user) {
        user = await User.create({
          email: userAuth.email,
          firstname: userAuth.name,
          lastname: "",
          password: null,
          active: true,
        });
      }
      console.log(req.user);
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      const check = await User.findOne({
        where: { email: userAuth.email },
      });
      if (!check) {
        return res.status(400).json({
          message: "Email Already Existed",
          status: "Bad Request",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully create an account",
        result: {
          token,
          user: {
            email: user.email,
            firstname: user.name,
            lastname: "",
            password: null,
          },
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  facebookCallback: async (req, res) => {
    const userFace = req.user._json;
    let user;
    try {
      user = await User.findOne({ where: { email: userFace.email } });
      if (!user) {
        user = await User.create({
          email: userFace.email,
          firstname: userFace.name,
          lastname: "",
          password: null,
          active: true,
        });
      }
      console.log(req.user);
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      const check = await User.findOne({
        where: { email: userFace.email },
      });
      if (!check) {
        return res.status(400).json({
          message: "Email Already Existed",
          status: "Bad Request",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully create an account",
        result: {
          token,
          user: {
            email: user.email,
            firstname: user.name,
            password: null,
          },
        },
      });
    } catch (error) {
      catchError(error, res);
    }
    console.log(req.user);
  },
};
