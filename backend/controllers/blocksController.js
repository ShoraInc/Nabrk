const { BLOCK_OPTIONS } = require("../constants/blockConstants");
const { Blocks, Pages, ContactInfoItems, sequelize } = require("../models");

const blocksController = {
  // Получить все блоки страницы
  getBlocksByPageId: async (req, res) => {
    try {
      const page = await Pages.findOne({
        where: { slug: req.params.slug },
        attributes: ["id", "slug"],
      });

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      const blocks = await Blocks.findAll({
        where: { pageId: page.id },
        order: [["order", "ASC"]],
      });

      // Возвращаем блоки с данными напрямую (переводы уже в data)
      const blocksData = blocks.map((block) => block.toJSON());

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

      // Если это contact-info блок, добавляем элементы
      if (block.type === 'contact-info') {
        const items = await ContactInfoItems.findAll({
          where: { blockId: block.id, isActive: true },
          order: [['order', 'ASC']]
        });
        
        const blockData = block.toJSON();
        blockData.items = items.map(item => item.toJSON());
        return res.json(blockData);
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

      // ВАЖНО: Если это contact-info блок, удаляем связанные элементы
      if (block.type === 'contact-info') {
        // Удаляем все элементы контактной информации
        // individualHooks: true активирует хук beforeDestroy для каждого элемента
        await ContactInfoItems.destroy({
          where: { blockId: block.id },
          individualHooks: true,
          transaction
        });
      }

      // Удаляем сам блок
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