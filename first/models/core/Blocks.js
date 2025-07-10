const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Blocks = sequelize.define(
  "Blocks",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pageId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    hooks: {
      beforeDestroy: async (block, options) => {
        console.log("🚀 Blocks beforeDestroy hook СРАБОТАЛ!");
        console.log("block.id:", block.id);
        console.log("block.type:", block.type);

        // Динамический импорт внутри hook для избежания циклических зависимостей
        if (block.type === "title") {
          console.log("🎯 Обрабатываем title блок");

          // Импортируем только когда нужно
          const TitleData = require("../blocks/titleBlock/TitleData");

          // Находим TitleData
          const titleData = await TitleData.findOne({
            where: { blockId: block.id },
            transaction: options.transaction,
          });

          if (titleData) {
            console.log(
              "📋 Найден TitleData с id:",
              titleData.id,
              "textId:",
              titleData.textId
            );

            // Удаляем вручную, чтобы сработали hooks TitleData
            await TitleData.destroy({
              where: { blockId: block.id },
              transaction: options.transaction,
              individualHooks: true,
            });

            console.log("✅ TitleData удален, hook должен был сработать");
          } else {
            console.log("⚠️ TitleData не найден для block.id:", block.id);
          }
        }

        if (block.type === "line") {
          console.log("📏 Обрабатываем line блок");
          const LineData = require("../blocks/lineBlock/LineData");
          await LineData.destroy({
            where: { blockId: block.id },
            transaction: options.transaction,
          });
        }
      },
    },
  }
);

module.exports = Blocks;
