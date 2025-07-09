const sequelize = require("../db");
const { Blocks, TitleData, TextTranslations, Texts } = require("../models");

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
      // Сначала находим блок чтобы проверить его тип
      const block = await Blocks.findByPk(req.params.id, {
        transaction,
      });

      if (!block) {
        await transaction.rollback();
        return res.status(404).json({ error: "Block not found" });
      }

      // Если блок типа "title", находим связанные данные
      if (block.type === "title") {
        const titleData = await TitleData.findOne({
          where: { blockId: req.params.id },
          transaction,
        });

        if (titleData) {
          // Удаляем TitleData
          await TitleData.destroy({
            where: { blockId: req.params.id },
            transaction,
          });

          // Удаляем переводы связанные с текстом
          await TextTranslations.destroy({
            where: { textId: titleData.textId },
            transaction,
          });

          // Удаляем сам текст
          await Texts.destroy({
            where: { id: titleData.textId },
            transaction,
          });
        }
      }

      // Удаляем сам блок
      await Blocks.destroy({
        where: { id: req.params.id },
        transaction,
      });

      await transaction.commit();
      res.json({ message: "Block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = blocksController;
