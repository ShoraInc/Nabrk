const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Types = sequelize.define("Types", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titleId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Types;


