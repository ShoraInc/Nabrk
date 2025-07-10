const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");

const TitleData = sequelize.define(
  "TitleData",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    blockId: { type: DataTypes.INTEGER, allowNull: false },
    textId: { type: DataTypes.INTEGER, allowNull: false },
    textAlign: {
      type: DataTypes.ENUM("left", "center", "right", "justify"),
      defaultValue: "left",
    },
    fontWeight: {
      type: DataTypes.ENUM(
        "100", "200", "300", "400", "500", "600", "700", "800", "900"
      ),
      defaultValue: "400",
    },
    fontSize: {
      type: DataTypes.ENUM(
        "12px", "14px", "16px", "18px", "20px", "24px", "32px", "48px"
      ),
      defaultValue: "16px",
    },
    color: { type: DataTypes.STRING, allowNull: true, defaultValue: "#000000" },
    marginTop: { type: DataTypes.INTEGER, defaultValue: 0 },
    marginBottom: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    hooks: {
      // Используем afterDestroy вместо beforeDestroy
      afterDestroy: async (titleData, options) => {
        console.log('🔥 TitleData afterDestroy hook СРАБОТАЛ!');
        console.log('titleData.id:', titleData.id);
        console.log('titleData.textId:', titleData.textId);
        console.log('options.transaction:', !!options.transaction);
        
        try {
          // Динамический импорт для избежания циклических зависимостей
          const TextTranslations = require("../../core/TextTranslations");
          const Texts = require("../../core/Texts");
          
          console.log('📝 Удаляем переводы для textId:', titleData.textId);
          
          // Удаляем переводы
          const deletedTranslations = await TextTranslations.destroy({
            where: { textId: titleData.textId },
            transaction: options.transaction,
          });
          
          console.log('✅ Удалено переводов:', deletedTranslations);
          
          console.log('📄 Удаляем текст с id:', titleData.textId);
          
          // Удаляем текст (теперь можно, так как TitleData уже удален)
          const deletedTexts = await Texts.destroy({
            where: { id: titleData.textId },
            transaction: options.transaction,
          });
          
          console.log('✅ Удалено текстов:', deletedTexts);
          
        } catch (error) {
          console.error('❌ Ошибка в TitleData hook:', error.message);
          throw error; // Прерываем транзакцию при ошибке
        }
      },
    },
  }
);

module.exports = TitleData;