const { config } = require("dotenv");

module.exports = function () {
  try {
    config();
  } catch (err) {
    throw new Error("FATAL Error: dotenv is not configured correctly!");
  }
};