const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Blocks = sequelize.define("Blocks", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pageId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
});

module.exports = Blocks;