const { getIncludesForBlockTypes } = require("../blockRegistry");
const sequelize = require("../db");
const { Blocks } = require("../models");
require("../blocksInit");

const blocksController = {
  // Получить все блоки страницы с их данными
  getBlocksByPageId: async (req, res) => {
    try {

      // Сначала получаем уникальные типы блоков на этой странице
      const blocks = await Blocks.findAll({
        where: { pageId: req.params.pageId },
        attributes: ["type"],
        group: ["type"],
        raw: true,
      });

      const blockTypes = blocks.map((block) => block.type);

      // Формируем includes на основе типов блоков
      const includes = getIncludesForBlockTypes(blockTypes);

      // Получаем все блоки с данными
      const blocksWithData = await Blocks.findAll({
        where: { pageId: req.params.pageId },
        order: [["order", "ASC"]],
        include: includes,
      });

      res.json(blocksWithData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Получить блок по ID с данными
  getBlockById: async (req, res) => {
    try {
      // Сначала получаем тип блока
      const block = await Blocks.findByPk(req.params.id, {
        attributes: ["id", "type", "pageId", "order"],
      });

      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }

      // Формируем include для этого типа блока
      const includes = getIncludesForBlockTypes([block.type]);

      // Получаем блок с данными
      const blockWithData = await Blocks.findByPk(req.params.id, {
        include: includes,
      });

      res.json(blockWithData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteBlock: async (req, res) => {
    console.log("🎯 Начинаем удаление блока с id:", req.params.id);

    const transaction = await sequelize.transaction();
    try {
      console.log("📋 Ищем блок...");

      const deleted = await Blocks.destroy({
        where: { id: req.params.id },
        transaction,
        individualHooks: true,
      });

      console.log("🗑️ Результат удаления:", deleted);

      if (!deleted) {
        await transaction.rollback();
        return res.status(404).json({ error: "Block not found" });
      }

      await transaction.commit();
      res.json({ message: "Block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = blocksController;
