const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");

const LineData = sequelize.define("LineData", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  blockId: { type: DataTypes.INTEGER, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: true, defaultValue: "#000000" },
  height: { type: DataTypes.INTEGER, defaultValue: 1 }, // толщина линии в пикселях
  width: { 
    type: DataTypes.ENUM("25%", "50%", "75%", "100%"), 
    defaultValue: "100%" 
  },
  style: {
    type: DataTypes.ENUM("solid", "dashed", "dotted"),
    defaultValue: "solid",
  },
  marginTop: { type: DataTypes.INTEGER, defaultValue: 10 },
  marginBottom: { type: DataTypes.INTEGER, defaultValue: 10 },
});

module.exports = LineData;