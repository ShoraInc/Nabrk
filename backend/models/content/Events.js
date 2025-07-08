const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Events = sequelize.define("Events", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nameTextId: { type: DataTypes.INTEGER, allowNull: false },
    descriptionTextId: { type: DataTypes.INTEGER, allowNull: false },
    eventDate: { type: DataTypes.DATE, allowNull: false },
    eventTime: { type: DataTypes.TIME, allowNull: true },
    placeTextId: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Events;