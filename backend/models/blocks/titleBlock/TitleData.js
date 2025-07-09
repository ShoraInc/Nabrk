const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");

const TitleData = sequelize.define("TitleData", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  blockId: { type: DataTypes.INTEGER, allowNull: false },
  textId: { type: DataTypes.INTEGER, allowNull: false }, // Ссылка на таблицу переводов
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
    type: DataTypes.ENUM(
      "12px",
      "14px",
      "16px",
      "18px",
      "20px",
      "24px",
      "32px",
      "48px"
    ),
    defaultValue: "16px",
  },
  color: { type: DataTypes.STRING, allowNull: true, defaultValue: "#000000" },
  marginTop: { type: DataTypes.INTEGER, defaultValue: 0 },
  marginBottom: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = TitleData;