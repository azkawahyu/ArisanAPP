const { User } = require("../models");
const jwt = require("jsonwebtoken");
const catchError = require("../utils/error");


module.exports = {
  isLogin: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({
            status: "Unauthorized",
          message: "No token detected",
        });
      }
      token = token.replace("Bearer ", "");
      jwt.verify(token, process.env.SECRET_TOKEN, async (error, decoded) => {
        if (error)
          return res.status(401).json({
            status: "Unauthorized",
            message: "Invalid access token",
          });
        const user = await User.findOne({
          where: {
            id: decoded.id,
          },
        });
        if (!user) {
          return res.status(401).json({
            status: "Unauthorized",
            message: "User not found",
          });
        }
        req.user = {
          id: decoded.id,
          email: decoded.email,
        };
        next();
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};

