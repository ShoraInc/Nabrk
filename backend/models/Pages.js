const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Pages = sequelize.define("Pages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM("draft", "published"),
    defaultValue: "draft"
  }
}, {
  tableName: 'Pages',
  underscored: true,
  
  // Индексы для оптимизации
  indexes: [
    {
      fields: ['status'] // для фильтрации по статусу
    },
    {
      fields: ['slug'], // уникальный индекс уже создается автоматически
      unique: true
    }
  ],
  
  // Валидация данных
  validate: {
    titleNotEmpty() {
      if (!this.title || this.title.trim().length === 0) {
        throw new Error('Title cannot be empty');
      }
    },
    slugNotEmpty() {
      if (!this.slug || this.slug.trim().length === 0) {
        throw new Error('Slug cannot be empty');
      }
    }
  }
});

module.exports = Pages;