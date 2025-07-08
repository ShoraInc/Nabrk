const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Pages = sequelize.define("Pages", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { 
        type: DataTypes.ENUM("draft", "published"), 
        defaultValue: "draft" 
    }
});

module.exports = Pages;