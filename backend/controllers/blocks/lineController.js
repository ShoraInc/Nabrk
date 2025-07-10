const { Blocks, Pages, sequelize } = require('../../models');

const lineController = {
  // Создать line блок
  create: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { 
        pageId, 
        order = 0,
        // Line-специфичные поля
        color = '#000000',
        height = 1,
        width = '100%',
        style = 'solid',
        marginTop = 10,
        marginBottom = 10
      } = req.body;
      
      // Проверяем существует ли страница
      const page = await Pages.findByPk(pageId, { transaction });
      if (!page) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Page with ID ${pageId} does not exist`
        });
      }
      
      // Подготавливаем данные для line блока
      const lineData = {
        color,
        height,
        width,
        style,
        marginTop,
        marginBottom
      };
      
      // Создаем блок
      const block = await Blocks.create({
        pageId,
        type: 'line',
        order,
        data: lineData
      }, { transaction });
      
      await transaction.commit();
      
      // Возвращаем блок
      res.status(201).json(block.toJSON());
      
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при создании line блока:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Получить line блок по ID
  getById: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);
      
      if (!block || block.type !== 'line') {
        return res.status(404).json({ error: 'Line block not found' });
      }
      
      res.json(block.toJSON());
    } catch (error) {
      console.error('Ошибка при получении line блока:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Обновить line блок
  update: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { order, color, height, width, style, marginTop, marginBottom } = req.body;
      
      const block = await Blocks.findByPk(req.params.id, { transaction });
      
      if (!block || block.type !== 'line') {
        await transaction.rollback();
        return res.status(404).json({ error: 'Line block not found' });
      }
      
      // Подготавливаем обновления
      const updates = {};
      if (order !== undefined) updates.order = order;
      
      // ИСПРАВЛЕНО: правильно обновляем data
      const currentData = block.data || {};
      const dataUpdates = { ...currentData };
      
      if (color !== undefined) dataUpdates.color = color;
      if (height !== undefined) dataUpdates.height = height;
      if (width !== undefined) dataUpdates.width = width;
      if (style !== undefined) dataUpdates.style = style;
      if (marginTop !== undefined) dataUpdates.marginTop = marginTop;
      if (marginBottom !== undefined) dataUpdates.marginBottom = marginBottom;
      
      // Проверяем нужно ли обновлять data
      if (JSON.stringify(dataUpdates) !== JSON.stringify(currentData)) {
        updates.data = dataUpdates;
      }
      
      // Обновляем блок если есть изменения
      if (Object.keys(updates).length > 0) {
        await block.update(updates, { transaction });
      }
      
      await transaction.commit();
      
      // Возвращаем обновленный блок
      const updatedBlock = await Blocks.findByPk(req.params.id);
      res.json(updatedBlock.toJSON());
      
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при обновлении line блока:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить line блок
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const block = await Blocks.findByPk(req.params.id, { transaction });
      
      if (!block || block.type !== 'line') {
        await transaction.rollback();
        return res.status(404).json({ error: 'Line block not found' });
      }
      
      // Удаляем блок
      await block.destroy({ transaction });
      
      await transaction.commit();
      res.json({ message: 'Line block deleted successfully' });
      
    } catch (error) {
      await transaction.rollback();
      console.error('Ошибка при удалении line блока:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = lineController;