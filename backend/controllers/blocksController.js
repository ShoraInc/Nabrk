const sequelize = require("../db");
const { Blocks, Texts, TextTranslations, TitleData } = require("../models");

const blocksController = {
  // Получить все блоки страницы
  getBlocksByPageId: async (req, res) => {
    try {
      const blocks = await Blocks.findAll({
        where: { pageId: req.params.pageId },
        order: [["order", "ASC"]],
      });
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Получить блок по ID
  getBlockById: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }

      res.json(block);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить блок
  deleteBlock: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      // Сначала находим блок
      const block = await Blocks.findByPk(req.params.id);

      if (!block) {
        await transaction.rollback();
        return res.status(404).json({ error: "Block not found" });
      }

      // Если это title блок, сначала очищаем связанные данные
      if (block.type === "title") {
        const titleData = await TitleData.findOne({
          where: { blockId: req.params.id },
          transaction,
        });

        if (titleData) {
          console.log(`Найден TitleData с textId: ${titleData.textId}`);

          // Удаляем переводы
          const deletedTranslations = await TextTranslations.destroy({
            where: { textId: titleData.textId },
            transaction,
          });
          console.log(`Удалено переводов: ${deletedTranslations}`);

          // Удаляем текст
          const deletedTexts = await Texts.destroy({
            where: { id: titleData.textId },
            transaction,
          });
          console.log(`Удалено текстов: ${deletedTexts}`);

          // Удаляем TitleData
          await TitleData.destroy({
            where: { blockId: req.params.id },
            transaction,
          });
          console.log(`TitleData удален`);
        }
      }

      // Удаляем сам блок
      const deleted = await Blocks.destroy({
        where: { id: req.params.id },
        transaction,
      });

      if (!deleted) {
        await transaction.rollback();
        return res.status(404).json({ error: "Block not found" });
      }

      await transaction.commit();
      res.json({ message: "Block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении блока:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = blocksController;
