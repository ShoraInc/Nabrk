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
    type: DataTypes.ENUM('phone', 'email', 'fax', 'file', 'link', 'video', 'address', 'custom'),
    allowNull: false,
    comment: 'Тип элемента контактной информации'
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'info',
    comment: 'Ключ иконки из Lucide React'
  },
  order: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0,
    comment: 'Порядок отображения в списке'
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Данные элемента: тексты, ссылки, настройки'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
    comment: 'Активен ли элемент'
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
      fields: ['data'],
      name: 'contact_info_items_data_gin_idx'
    }
  ],
  
  validate: {
    // Упрощенная валидация - только критические проверки
    validateBasicStructure() {
      const { data } = this;
      
      // Проверяем что data существует
      if (!data || typeof data !== 'object') {
        throw new Error('Data field is required and must be an object');
      }
      
      // Мягкая проверка texts - если есть, то должен быть объектом
      if (data.texts && typeof data.texts !== 'object') {
        throw new Error('Texts field must be an object');
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
  if (item.type === 'file' && item.data.value) {
    const { deleteFile } = require('../middleware/contactsFilesUploadMiddleware');
    await deleteFile(item.data.value);
  }
});

module.exports = ContactInfoItems;