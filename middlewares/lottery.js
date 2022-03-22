const { Arisan } = require("../models");
const catchError = require("../utils/error");
module.exports = async (req, res, next) => {
  try {
    const id = req.params.arisanId;
    const arisan = await Arisan.findOne({ where: { id: id } });
    const now = new Date();
    const lotteryDate = new Date(arisan.lotteryDate);
    if (now > lotteryDate) {
      await Arisan.update({ status: false }, { where: { id: id } });
    } else {
      await Arisan.update({ status: true }, { where: { id: id } });
    }
    next();
  } catch (error) {
    catchError(error, res);
  }
};
