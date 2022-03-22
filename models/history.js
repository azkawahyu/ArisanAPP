'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Participant, { foreignKey: 'participantId' })
      History.belongsTo(models.Arisan, { foreignKey: 'arisanId' })
    }
  }
  History.init({
    participantId: DataTypes.INTEGER,
    arisanId: DataTypes.INTEGER,
    periode: DataTypes.STRING,
    balance: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};