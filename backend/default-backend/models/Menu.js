const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Menu = sequelize.define("Menu", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Menus",
      key: "id",
    },
  },
  type: {
    type: DataTypes.ENUM("title", "link", "page"),
    allowNull: false,
    defaultValue: "title",
  },
  titleKz: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titleRu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titleEn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: function (value) {
        if (this.type === "link" && !value) {
          throw new Error("URL is required for 'link' type.");
        }
        if (value && !/^https?:\/\//i.test(value)) {
          throw new Error("URL must start with http:// or https://");
        }
      },
    },
  },
  pageSlug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: "Menus",
  timestamps: true,
  paranoid: true, // Включаем soft delete
});

// Самосвязь для иерархии
Menu.hasMany(Menu, {
  foreignKey: "parentId",
  as: "children",
  onDelete: "CASCADE",
});

Menu.belongsTo(Menu, {
  foreignKey: "parentId",
  as: "parent",
});

module.exports = Menu;
