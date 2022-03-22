"use strict";
const nodemailer = require("nodemailer");
exports.sendEmail = async function (to, subject, text, html) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ga.arisan.app@gmail.com",
      pass: "Arisan123",
    },
  });
    
  await transporter.sendMail({
    from: "ga.arisan.app@gmail.com",
    to,
    subject,
    text,
    html,
  });
};