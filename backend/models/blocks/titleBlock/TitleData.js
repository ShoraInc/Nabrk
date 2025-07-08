const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");

const TitleData = sequelize.define("TitleData", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  blockId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  textAlign: {
    type: DataTypes.ENUM("left", "center", "right", "justify"),
    defaultValue: "left",
  },
  fontWeight: {
    type: DataTypes.ENUM(
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900"
    ),
    defaultValue: "400",
  },
  fontSize: {
    type: DataTypes.ENUM("small", "medium", "large", "xlarge"),
    defaultValue: "medium",
  },
  color: { type: DataTypes.STRING, allowNull: true, defaultValue: "#000000" },

  marginTop: { type: DataTypes.INTEGER, defaultValue: 0 },
  marginBottom: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = TitleData;
