const { User, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const catchError = require("../utils/error");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../helpers/emailSender");

module.exports = {
  register: async (req, res) => {
    let transaction;
    const body = req.body;
    const hashedPassword = bcrypt.hashSync(body.password, 10);
    try {
      transaction = await sequelize.transaction();
      const check = await User.findOne({
        where: {
          phoneNumber: body.phoneNumber,
        },
      });
      if (check) {
        if (check.dataValues.active)
          return res.status(400).json({
            status: "Bad Request",
            message: "phoneNumber already exists",
          });
        var user = await User.update(
          {
            phoneNumber: body.phoneNumber,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword,
            active: true,
            saldo: 0,
          },
          {
            where: {
              phoneNumber: body.phoneNumber,
            },
            returning: true,
          }
        );
        user = user[1][0].dataValues;
      } else {
        var user = await User.create({
          phoneNumber: body.phoneNumber,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: hashedPassword,
          active: true,
          saldo:0
        });
      }
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );

      await sendEmail(
        user.email,
        "registration success",
        `Welcome ${user.firstName}`
      );
      res.status(200).json({
        status: "Success",
        message: "Successfully to create an account",
        result: {
          token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
          },
        },
      });
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      catchError(error, res);
    }
  },
  login: async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
      const user = await User.findOne({
        where: {
          phoneNumber,
        },
      });
      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid phoneNumber and password combination",
        });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Invalid phoneNumber and password combination",
          result: {},
        });
      }
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        status: "Success",
        message: "Logged in successfully",
        result: {
          token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
          },
        },
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
