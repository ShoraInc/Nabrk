const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Blocks = sequelize.define(
  "Blocks",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "page_id",
    },
    type: {
      type: DataTypes.ENUM("title", "line", "contact-info", "faq"),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_hidden",
      comment: "Скрыть блок от отображения на странице (для дочерних блоков FAQ)",
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: "Все данные блока: переводы, стили, настройки",
    },
  },
  {
    tableName: "Blocks",
    underscored: true,

    // Индексы для JSONB
    indexes: [
      {
        fields: ["page_id", "order"], // для сортировки блоков на странице
      },
      {
        fields: ["type"], // для поиска по типу
      },
      {
        fields: ["is_hidden"], // для фильтрации скрытых блоков
      },
      {
        type: "GIN",
        fields: ["data"], // GIN индекс для JSONB поиска
      },
    ],

    // Валидация данных
    validate: {
      validateDataStructure() {
        try {
          // Импортируем валидаторы здесь, чтобы избежать циклических зависимостей
          const { validateBlockData } = require("../validators");
          validateBlockData(this.type, this.data);
        } catch (error) {
          console.warn("Validation error in block:", error.message);
          throw new Error(`Block validation failed: ${error.message}`);
        }
      },
    },
  }
);

module.exports = Blocks;
