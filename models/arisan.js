"use strict";
const { Model } = require("sequelize");
const generateId = require("../utils/id-generator");
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  class Arisan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Arisan.belongsTo(models.User, { as: "user", foreignKey: "userId" });
      Arisan.hasMany(models.Participant, {
        as: "participant",
        foreignKey: "arisanId",
      });
      Arisan.hasMany(models.History, { foreignKey: "arisanId" });
      Arisan.hasMany(models.Memory, { foreignKey: "arisanId" });
    }
  }
  Arisan.init(
    {
      idArisan: DataTypes.STRING(6),
      title: DataTypes.STRING,
      dues: DataTypes.STRING,
      paymentPeriod: DataTypes.ENUM(["Mingguan", "Bulanan"]),
      lotteryDate: DataTypes.DATEONLY,
      balance: DataTypes.INTEGER,
      totalParticipant: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Arisan",
      hooks: {
        beforeCreate: (arisan) => {
          arisan.idArisan = generateId(arisan.idArisan);
        },
      },
    }
  );
  return Arisan;
};
