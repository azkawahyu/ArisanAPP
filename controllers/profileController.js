const { User, Arisan, sequelize } = require("../models");
const catchError = require("../utils/error");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");

module.exports = {
  fetchAccountInfo: async (req, res) => {
    try {
      const data2 = await Arisan.findAll({
        where: {
          userId: req.user.id,
        },
      });
      let saldo = 0;
      for (let i = 0; i < data2.length; i++) {
        saldo += data2[i].balance;
      }
      await User.update(
        {
          saldo: saldo,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      const data = await User.findByPk(req.user.id, {
        attributes: ["firstName", "lastName", "email", "image", "saldo"],
        attributes: [
          "firstName",
          "lastName",
          "email",
          "image",
          "phoneNumber",
          "saldo",
        ],
      });

      res.status(200).json({
        status: "Success",
        message: "Profile Fetched",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  uploadImage: async (req, res) => {
    try {
      const { path } = await req.file;
      await User.update(
        {
          image: path,
        },
        { where: { id: req.user.id } }
      );
      res.status(200).json({
        status: "Success",
        message: "Profile photo updated",
        result: path,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  editProfile: async (req, res) => {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const { firstName, lastName, email } = await req.body;
      await User.update(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
        },
        { where: { id: req.user.id } },
        transaction
      );
      res.status(200).json({
        status: "Success",
        message: "Profile updated",
      });
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      catchError(error, res);
    }
  },
  changePassword: async (req, res) => {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const { newPassword, oldPassword } = await req.body;
      const { password } = await User.findByPk(req.user.id, {
        attributes: ["password"],
      });
      const comp = bcrypt.compareSync(oldPassword, password);
      if (!comp)
        return res.status(500).json({
          status: "failed",
          message: "Password did not match",
        });
      await User.update(
        {
          password: bcrypt.hashSync(newPassword, 10),
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      res.status(200).json({
        status: "Success",
        message: "Password updated",
      });
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      catchError(error, res);
    }
  },
  deleteImage: async (req, res) => {
    try {
      const { image } = await User.findByPk(req.user.id);
      const public_id = await image.substr(60);
      console.log(public_id);
      await cloudinary.v2.api.delete_resources(public_id);

      User.update(
        {
          image:
            "https://res.cloudinary.com/ddvobptro/image/upload/v1642494701/siluet_wni7t4.png",
        },
        {
          where: { id: req.user.id },
        }
      );
      res.status(200).json({
        status: "Success",
        message: "image deleted",
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
