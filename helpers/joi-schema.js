const Joi = require("joi").extend(require("@joi/date"));

module.exports = {
  registerSchema: Joi.object({
    phoneNumber: Joi.string()
      .regex(/^[0-9]+$/)
      .message("Invalid Phone Number")
      .min(10)
      .max(12)
      .required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(5)
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])/)
      .message(
        '"password" should contain a mix of uppercase and lowercase letters, numbers, and special characters '
      )
      .required(),
  }),
  loginSchema: Joi.object({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
  }),
  createArisanSchema: Joi.object({
    title: Joi.string().required(),
    dues: Joi.number().required(),
    paymentPeriod: Joi.required(),
    lotteryDate: Joi.date().format("DD-MM-YYYY").required(),
  }),
  updateArisanSchema: Joi.object({
    title: Joi.string(),
    dues: Joi.number(),
    paymentPeriod: Joi.string(),
    lotteryDate: Joi.date().format("DD-MM-YYYY"),
  }),
  editProfileSchema: Joi.object({
    phoneNumber: Joi.string()
      .min(10)
      .max(12)
      .regex(/^[0-9]+$/)
      .message("Invalid Phone Number"),
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
  }),
  editPasswordSchema: Joi.object({
    newPassword: Joi.string()
      .min(5)
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])/)
      .message(
        '"password" should contain a mix of uppercase and lowercase letters, numbers, and special characters '
      )
      .required(),
    oldPassword: Joi.string().required(),
  }),
  createContactSchema: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string()
      .min(10)
      .max(12)
      .regex(/^[0-9]+$/)
      .message("Invalid Phone Number")
      .required(),
  }),
};
