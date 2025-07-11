const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ContactInfoItems = sequelize.define("ContactInfoItems", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  blockId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'block_id',
    references: {
      model: 'Blocks',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: { 
    type: DataTypes.ENUM('text', 'link', 'file'),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'info'
  },
  order: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0
  },
  text: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  value: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'ContactInfoItems',
  underscored: true,
  
  indexes: [
    {
      fields: ['block_id', 'order'],
      name: 'contact_info_items_block_order_idx'
    },
    {
      fields: ['type'],
      name: 'contact_info_items_type_idx'
    },
    {
      fields: ['is_active'],
      name: 'contact_info_items_active_idx'
    },
    {
      type: 'GIN',
      fields: ['text'], // GIN индекс для JSONB поиска по переводам
      name: 'contact_info_items_text_gin_idx'
    }
  ],
  
  validate: {
    // Упрощенная валидация
    validateBasicStructure() {
      // Проверяем что есть текст
      if (!this.text || this.text.trim().length === 0) {
        throw new Error('Text field is required');
      }
      
      // Валидация в зависимости от типа
      if (this.type === 'link' && !this.value) {
        throw new Error('Link type requires value field');
      }
      
      if (this.type === 'file' && !this.value) {
        throw new Error('File type requires value field (file path)');
      }
    }
  }
});

// Хуки для автоматической обработки
ContactInfoItems.addHook('beforeValidate', (item) => {
  // Если не указан порядок, ставим в конец
  if (!item.order && item.order !== 0) {
    return ContactInfoItems.findOne({
      where: { blockId: item.blockId },
      order: [['order', 'DESC']]
    }).then(lastItem => {
      item.order = lastItem ? lastItem.order + 1 : 0;
    });
  }
});

ContactInfoItems.addHook('beforeDestroy', async (item) => {
  console.log(`🗑️ Удаляется ContactInfoItem ID: ${item.id}, type: ${item.type}`);
  
  // Если это файл, удаляем его с сервера
  if (item.type === 'file' && item.value) {
    const { deleteFile } = require('../middleware/contactsFilesUploadMiddleware');
    await deleteFile(item.value);
  }
});

module.exports = ContactInfoItems;