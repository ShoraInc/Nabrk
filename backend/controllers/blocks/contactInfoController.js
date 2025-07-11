const { Blocks, ContactInfoItems, Pages, sequelize } = require("../../models");
const { AVAILABLE_ICONS, ICON_CATEGORIES, RECOMMENDED_ICONS } = require("../../constants/iconConstants");
const { deleteFile } = require("../../middleware/contactsFilesUploadMiddleware");

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
          if (!item.type || !['text', 'link', 'file'].includes(item.type)) {
            throw new Error(`Item ${i}: type must be 'text', 'link', or 'file'`);
          }
          
          if (!item.text || item.text.trim().length === 0) {
            throw new Error(`Item ${i}: text is required`);
          }
          
          await ContactInfoItems.create({
            blockId: block.id,
            type: item.type,
            icon: item.icon || 'info',
            order: i,
            text: item.text,
            value: item.value || null,
            fileName: item.fileName || null
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
      let { type, icon, text, value } = req.body;
      
      // Проверяем существование блока
      const block = await Blocks.findOne({
        where: { id: blockId, type: 'contact-info' },
        transaction
      });
      
      if (!block) {
        await transaction.rollback();
        return res.status(404).json({ error: "Contact info block not found" });
      }
      
      // Парсим text если это строка (из multipart/form-data)
      // Для обычного текста text уже строка, парсить не нужно
      
      // Валидация типа
      if (!type || !['text', 'link', 'file'].includes(type)) {
        await transaction.rollback();
        return res.status(400).json({ error: "Type must be 'text', 'link', or 'file'" });
      }
      
      // Обрабатываем загруженный файл
      let processedValue = value;
      let fileName = null;
      
      if (req.file) {
        if (type !== 'file') {
          await transaction.rollback();
          return res.status(400).json({ error: "File upload is only allowed for type 'file'" });
        }
        processedValue = `/uploads/blocks/contact-info/${req.file.filename}`;
        fileName = req.file.originalname;
      }
      
      // Для типа file обязательно нужен файл
      if (type === 'file' && !processedValue) {
        await transaction.rollback();
        return res.status(400).json({ error: "File type requires file upload" });
      }
      
      // Для типа link обязательно нужно значение
      if (type === 'link' && !processedValue) {
        await transaction.rollback();
        return res.status(400).json({ error: "Link type requires value field" });
      }
      
      const item = await ContactInfoItems.create({
        blockId: parseInt(blockId),
        type,
        icon: icon || 'info',
        text: text,
        value: processedValue,
        fileName: fileName
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
      let { type, icon, text, value } = req.body;
      
      const item = await ContactInfoItems.findByPk(id, { transaction });
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({ error: "Item not found" });
      }
      
      // Для обычного текста text уже строка, парсить не нужно
      
      // Обрабатываем новый файл
      let processedValue = value;
      let fileName = item.fileName;
      
      if (req.file) {
        // Удаляем старый файл если был
        if (item.type === 'file' && item.value) {
          await deleteFile(item.value);
        }
        
        processedValue = `/uploads/blocks/contact-info/${req.file.filename}`;
        fileName = req.file.originalname;
      }
      
      await item.update({
        type: type || item.type,
        icon: icon || item.icon,
        text: text || item.text,
        value: processedValue !== undefined ? processedValue : item.value,
        fileName: fileName
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