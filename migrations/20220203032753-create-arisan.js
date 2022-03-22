"use strict";
const generateId = require("../utils/id-generator");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Arisans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idArisan: {
        allowNull: false,
        type: Sequelize.STRING(6),
        defaultValue: generateId(),
      },
      title: {
        type: Sequelize.STRING,
      },
      dues: {
        type: Sequelize.INTEGER,
      },
      paymentPeriod: {
        type: Sequelize.ENUM(["Mingguan", "Bulanan"]),
      },
      lotteryDate: {
        type: Sequelize.DATEONLY,
      },
      balance: {
        type: Sequelize.INTEGER,
      },
      totalParticipant: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Arisans");
  },
};
