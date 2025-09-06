const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Question = sequelize.define("Question", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Name: { type: DataTypes.STRING, allowNull: false },
  LastName: { type: DataTypes.STRING, allowNull: false },
  Question: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = Question;


