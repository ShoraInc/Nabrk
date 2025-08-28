const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Texts = sequelize.define('Texts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

module.exports = Texts;