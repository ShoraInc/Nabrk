const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const TextTranslations = sequelize.define("TextTranslations", {
  textId: { type: DataTypes.INTEGER },
  languageCode: {
    type: DataTypes.ENUM("en", "ru", "kz", "qaz"),
    allowNull: false,
  },
  textValue: { type: DataTypes.TEXT },
});

module.exports = TextTranslations;
