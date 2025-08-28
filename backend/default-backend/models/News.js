const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const News = sequelize.define("News", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titleTextId: { type: DataTypes.INTEGER, allowNull: false },
    shortDescriptionTextId: { type: DataTypes.INTEGER, allowNull: true },
    contentTextId: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    publishedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = News;