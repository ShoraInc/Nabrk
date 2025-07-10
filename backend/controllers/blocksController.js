const { BLOCK_OPTIONS } = require("../constants/blockConstants");
const { Blocks, Pages, sequelize } = require("../models");

const blocksController = {
  // Получить все блоки страницы
  getBlocksByPageId: async (req, res) => {
    try {
      const blocks = await Blocks.findAll({
        where: { pageId: req.params.pageId },
        order: [["order", "ASC"]],
      });

      // Возвращаем блоки с данными напрямую (переводы уже в data)
      const blocksData = blocks.map(block => block.toJSON());

      res.json(blocksData);
    } catch (error) {
      console.error("Ошибка при получении блоков страницы:", error);
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

      res.json(block.toJSON());
    } catch (error) {
      console.error("Ошибка при получении блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить блок
  deleteBlock: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block) {
        await transaction.rollback();
        return res.status(404).json({ error: "Block not found" });
      }

      // Просто удаляем блок (больше не нужно удалять связанные тексты)
      await block.destroy({ transaction });

      await transaction.commit();
      res.json({ message: "Block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Получить опции для всех блоков
  getBlockOptions: async (req, res) => {
    try {
      res.json({ ...BLOCK_OPTIONS });
    } catch (error) {
      console.error("Ошибка при получении опций:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = blocksController;