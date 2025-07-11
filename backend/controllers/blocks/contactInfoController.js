const { Blocks, ContactInfoItems, Pages, sequelize } = require("../../models");
const { AVAILABLE_ICONS, ICON_CATEGORIES, RECOMMENDED_ICONS } = require("../../constants/iconConstants");
const { getRelativePath, deleteFile } = require("../../middleware/contactsFilesUploadMiddleware");

const contactInfoController = {
  // Создать блок контактной информации
  createBlock: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { pageId, title, items = [], settings = {} } = req.body;
      
      // Проверяем существование страницы
      const page = await Pages.findByPk(pageId);
      if (!page) {
        await transaction.rollback();
        return res.status(404).json({ error: "Page not found" });
      }
      
      // Находим максимальный порядок для страницы
      const maxOrderBlock = await Blocks.findOne({
        where: { pageId },
        order: [['order', 'DESC']],
        transaction
      });
      
      const blockOrder = maxOrderBlock ? maxOrderBlock.order + 1 : 0;
      
      // Создаем блок
      const block = await Blocks.create({
        pageId,
        type: 'contact-info',
        order: blockOrder,
        data: {
          title: title || {},
          settings: {
            showTitle: true,
            itemSpacing: 'normal',
            iconSize: 'medium',
            ...settings
          }
        }
      }, { transaction });
      
      // Создаем элементы если переданы
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          
          // Проверяем обязательные поля для элемента
          if (!item.type) {
            throw new Error(`Item ${i}: type is required`);
          }
          
          if (!item.texts || Object.keys(item.texts).length === 0) {
            throw new Error(`Item ${i}: texts is required and must contain at least one translation`);
          }
          
          await ContactInfoItems.create({
            blockId: block.id,
            type: item.type,
            icon: item.icon || 'info',
            order: i,
            data: {
              texts: item.texts,
              value: item.value || '',
              fileName: item.fileName || null,
              downloadable: item.downloadable || false,
              settings: item.settings || {}
            }
          }, { transaction });
        }
      }
      
      await transaction.commit();
      
      // Получаем созданный блок с элементами
      const createdBlock = await contactInfoController.getBlockWithItems(block.id);
      
      res.status(201).json(createdBlock);
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при создании блока контактной информации:", error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // Получить блок с элементами
  getBlock: async (req, res) => {
    try {
      const block = await contactInfoController.getBlockWithItems(req.params.id);
      
      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }
      
      res.json(block);
    } catch (error) {
      console.error("Ошибка при получении блока:", error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // Обновить блок
  updateBlock: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { title, settings } = req.body;
      
      const block = await Blocks.findByPk(req.params.id, { transaction });
      if (!block) {
        await transaction.rollback();
        return res.status(404).json({ error: "Block not found" });
      }
      
      // Обновляем данные блока
      const updatedData = { ...block.data };
      if (title !== undefined) updatedData.title = title;
      if (settings !== undefined) updatedData.settings = { ...updatedData.settings, ...settings };
      
      await block.update({ data: updatedData }, { transaction });
      
      await transaction.commit();
      
      const updatedBlock = await contactInfoController.getBlockWithItems(block.id);
      res.json(updatedBlock);
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при обновлении блока:", error);
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
      
      // Удаляем все элементы (хук автоматически удалит файлы)
      await ContactInfoItems.destroy({
        where: { blockId: block.id },
        individualHooks: true,
        transaction
      });
      
      // Удаляем блок
      await block.destroy({ transaction });
      
      await transaction.commit();
      res.json({ message: "Block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении блока:", error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // === УПРАВЛЕНИЕ ЭЛЕМЕНТАМИ ===
  
  // Создать элемент
  createItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { blockId } = req.params;
      let { type, icon, texts, value, fileName, downloadable, settings, kz, ru, en } = req.body;
      
      // Проверяем существование блока
      const block = await Blocks.findOne({
        where: { id: blockId, type: 'contact-info' },
        transaction
      });
      
      if (!block) {
        await transaction.rollback();
        return res.status(404).json({ error: "Contact info block not found" });
      }
      
      // При multipart/form-data JSON поля приходят как строки - парсим их
      try {
        if (typeof texts === 'string') {
          texts = JSON.parse(texts);
        }
        if (typeof settings === 'string') {
          settings = JSON.parse(settings);
        }
        if (typeof downloadable === 'string') {
          downloadable = downloadable === 'true';
        }
      } catch (parseError) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: "Invalid JSON format in texts or settings field" 
        });
      }
      
      // Обрабатываем тексты - поддерживаем два формата
      let processedTexts = texts || {};
      
      // Если тексты переданы как отдельные поля (kz, ru, en)
      if (!texts && (kz || ru || en)) {
        processedTexts = {};
        if (kz) processedTexts.kz = kz;
        if (ru) processedTexts.ru = ru;
        if (en) processedTexts.en = en;
      }
      
      // Проверяем что хотя бы один текст передан
      if (!processedTexts || Object.keys(processedTexts).length === 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: "Texts are required. Use either 'texts' object or individual 'kz', 'ru', 'en' fields" 
        });
      }
      
      if (req.file) {
        processedValue = getRelativePath(req.file.filename);
        processedFileName = req.file.originalname;
      }
      
      const item = await ContactInfoItems.create({
        blockId: parseInt(blockId),
        type,
        icon: icon || 'info',
        data: {
          texts: processedTexts,
          value: processedValue || '',
          fileName: processedFileName || null,
          downloadable: downloadable || false,
          settings: settings || {}
        }
      }, { transaction });
      
      await transaction.commit();
      res.status(201).json(item);
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при создании элемента:", error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // Обновить элемент
  updateItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      let { type, icon, texts, value, fileName, downloadable, settings, kz, ru, en } = req.body;
      
      const item = await ContactInfoItems.findByPk(id, { transaction });
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({ error: "Item not found" });
      }
      
      // При multipart/form-data JSON поля приходят как строки - парсим их
      try {
        if (typeof texts === 'string') {
          texts = JSON.parse(texts);
        }
        if (typeof settings === 'string') {
          settings = JSON.parse(settings);
        }
        if (typeof downloadable === 'string') {
          downloadable = downloadable === 'true';
        }
      } catch (parseError) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: "Invalid JSON format in texts or settings field" 
        });
      }
      
      // Обрабатываем тексты - поддерживаем два формата
      let processedTexts = texts;
      
      // Если тексты переданы как отдельные поля (kz, ru, en)
      if (!texts && (kz || ru || en)) {
        processedTexts = {};
        if (kz) processedTexts.kz = kz;
        if (ru) processedTexts.ru = ru;
        if (en) processedTexts.en = en;
      }
      
      // Обрабатываем новый файл
      let processedValue = value;
      let processedFileName = fileName;
      
      if (req.file) {
        // Удаляем старый файл если был
        if (item.type === 'file' && item.data.value) {
          await deleteFile(item.data.value);
        }
        
        processedValue = getRelativePath(req.file.filename);
        processedFileName = req.file.originalname;
      }
      
      // Обновляем данные
      const updatedData = { ...item.data };
      if (processedTexts !== undefined) updatedData.texts = processedTexts;
      if (processedValue !== undefined) updatedData.value = processedValue;
      if (processedFileName !== undefined) updatedData.fileName = processedFileName;
      if (downloadable !== undefined) updatedData.downloadable = downloadable;
      if (settings !== undefined) updatedData.settings = { ...updatedData.settings, ...settings };
      
      await item.update({
        type: type || item.type,
        icon: icon || item.icon,
        data: updatedData
      }, { transaction });
      
      await transaction.commit();
      res.json(item);
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при обновлении элемента:", error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // Удалить элемент
  deleteItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const item = await ContactInfoItems.findByPk(req.params.id, { transaction });
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({ error: "Item not found" });
      }
      
      await item.destroy({ transaction });
      
      await transaction.commit();
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении элемента:", error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // Изменить порядок элементов
  reorderItems: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { blockId } = req.params;
      const { itemsOrder } = req.body; // массив [{ id, order }]
      
      for (const { id, order } of itemsOrder) {
        await ContactInfoItems.update(
          { order },
          { where: { id, blockId }, transaction }
        );
      }
      
      await transaction.commit();
      res.json({ message: "Items reordered successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при изменении порядка:", error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===
  
  // Получить блок с элементами
  getBlockWithItems: async (blockId) => {
    const block = await Blocks.findByPk(blockId);
    if (!block || block.type !== 'contact-info') {
      return null;
    }
    
    const items = await ContactInfoItems.findAll({
      where: { blockId, isActive: true },
      order: [['order', 'ASC']]
    });
    
    return {
      ...block.toJSON(),
      items: items.map(item => item.toJSON())
    };
  },
  
  // Получить доступные иконки
  getAvailableIcons: async (req, res) => {
    try {
      res.json({
        icons: AVAILABLE_ICONS,
        categories: ICON_CATEGORIES,
        recommended: RECOMMENDED_ICONS
      });
    } catch (error) {
      console.error("Ошибка при получении иконок:", error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = contactInfoController;