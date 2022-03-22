"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Participant.belongsTo(models.User, { as: "user", foreignKey: "userId" });
      Participant.belongsTo(models.Arisan, {
        as: "arisan",
        foreignKey: "arisanId",
      });
      Participant.hasMany(models.History, { foreignKey: "participantId" });
    }
  }
  Participant.init(
    {
      userId: DataTypes.INTEGER,
      arisanId: DataTypes.INTEGER,
      haveWon: DataTypes.BOOLEAN,
      havePaid: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Participant",
    }
  );
  return Participant;
};
