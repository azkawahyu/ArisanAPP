const catchError = require("../utils/error");
const { Contact, User } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { name, phoneNumber, email } = await req.body;
      const { id } = await req.user;
      const search = await Contact.findOne({
        where: {phoneNumber: phoneNumber, userId: id}
      })
      if (search) {
        return res.status(400).json({
          status: "Failed",
          message: "Cannot add exsisting phoneNumber",
          result: {}
        });
      }
      const data = await Contact.create({
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        userId: id,
      });
      const check = await User.findOne({
        where: { phoneNumber: phoneNumber },
      });

      if (!check) {
        await User.create({
          firstName: name,
          phoneNumber: phoneNumber,
          email: email,
          active: false,
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully to create contact",
        result: data,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  edit: async (req, res) => {
    try {
      const { name, email } = await req.body;
      await Contact.update(
        {
          name: name,
          email: email,
        },
        {
          where: {
            userId: req.user.id,
            id: req.params.id,
          },
        }
      );
      res.status(200).json({
        status: "Success",
        message: "Successfully to updated contact",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  remove: async (req, res) => {
    try {
      await Contact.destroy({
        where: {
          userId: req.user.id,
          id: req.params.id,
        },
      });
      res.status(200).json({
        status: "Success",
        message: "Successfully to delete contact",
        result: {},
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  fetchAll: async (req, res) => {
    try {
      const search = await Contact.findAll({
        where: {
          userId: req.user.id,
        },
      });
      const result = search
      for (let i = 0; i < search.length; i++){
        const data = await User.findAll({
          where: {
            phoneNumber: search[i].phoneNumber,
          },
          attributes: ["image"]
        });
        result[i].dataValues.image = data[0].dataValues.image
      }   
      if (search.length == 0)
        return res.status(200).json({
          status: "Success",
          message: "Contact Empty",
          result: {}
        });
      res.status(200).json({
        status: "Success",
        message: "Successfully to fetch contact",
        result: search,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
};
