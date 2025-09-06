const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Answers = sequelize.define("Answers", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  questionId: { type: DataTypes.INTEGER, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  adminId: { type: DataTypes.INTEGER, allowNull: true },
  typeId: { type: DataTypes.INTEGER, allowNull: true },
  published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

module.exports = Answers;


