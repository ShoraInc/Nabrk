const { BLOCK_OPTIONS } = require("../constants/blockConstants");
const { Blocks, Pages, ContactInfoItems, sequelize, BlockRelations } = require("../models");
const { validateBlockData } = require("../validators");
const { deleteBlockImageFile } = require("../middleware/blockImageUploadMiddleware");

const blocksController = {
  // Получить все блоки страницы по slug
  getBlocksByPageSlug: async (req, res) => {
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

  // Получить все блоки страницы по ID
  getBlocksByPageId: async (req, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      
      // Проверяем существование страницы
      const page = await Pages.findByPk(pageId);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      const blocks = await Blocks.findAll({
        where: { pageId: pageId },
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

      // ВАЖНО: Если это text-image блок, удаляем файл изображения
      if (block.type === 'text-image' && block.data?.imagePath) {
        deleteBlockImageFile(block.data.imagePath);
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

  // Создать FAQ блок
  createFaqBlock: async (req, res) => {
    try {
      const { pageId, data, isChildBlock = false, isHidden = false } = req.body;

      if (!pageId || !data) {
        return res.status(400).json({ error: "pageId and data are required" });
      }

      // Проверяем существование страницы
      const page = await Pages.findByPk(pageId);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      // Валидация данных блока
      try {
        validateBlockData('faq', data);
      } catch (validationError) {
        return res.status(400).json({ error: validationError.message });
      }

      // Создаем FAQ блок
      const block = await Blocks.create({
        pageId,
        type: 'faq',
        order: 0, // Будет обновлено автоматически
        isHidden: isHidden || isChildBlock, // Используем isHidden или isChildBlock
        data: data || {}
      });

      res.status(201).json({
        message: "FAQ block created successfully",
        block
      });
    } catch (error) {
      console.error("Error creating FAQ block:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Обновить FAQ блок
  updateFaqBlock: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;

      if (!data) {
        return res.status(400).json({ error: "data is required" });
      }

      // Проверяем существование блока
      const block = await Blocks.findByPk(id);
      if (!block) {
        return res.status(404).json({ error: "FAQ block not found" });
      }

      if (block.type !== 'faq') {
        return res.status(400).json({ error: "Block is not a FAQ block" });
      }

      // Валидация данных блока
      try {
        validateBlockData('faq', data);
      } catch (validationError) {
        return res.status(400).json({ error: validationError.message });
      }

      // Обновляем данные блока
      await block.update({
        data: data,
        ...(typeof req.body.isHidden !== 'undefined' ? { isHidden: req.body.isHidden } : {})
      });

      res.json({
        message: "FAQ block updated successfully",
        block: block.toJSON()
      });
    } catch (error) {
      console.error("Error updating FAQ block:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

// Проверить, используется ли блок как ответ в FAQ
const isBlockUsedInFaq = async (req, res) => {
  try {
    const { blockId } = req.params;
    const relations = await BlockRelations.findAll({
      where: { childBlockId: blockId, relationType: 'faq_answer' }
    });
    res.json({ used: relations.length > 0, relations });
  } catch (error) {
    console.error("Error checking if block is used in FAQ:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  ...blocksController,
  isBlockUsedInFaq,
};