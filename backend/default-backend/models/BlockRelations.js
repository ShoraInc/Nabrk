const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const BlockRelations = sequelize.define("BlockRelations", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parentBlockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "parent_block_id",
    references: {
      model: 'Blocks',
      key: 'id'
    }
  },
  childBlockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "child_block_id",
    references: {
      model: 'Blocks',
      key: 'id'
    }
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "order_index"
  },
  relationType: {
    type: DataTypes.ENUM("faq_answer"),
    allowNull: false,
    defaultValue: "faq_answer",
    field: "relation_type"
  }
}, {
  tableName: "BlockRelations",
  underscored: true,
  
  // Индексы для оптимизации
  indexes: [
    {
      fields: ['parent_block_id', 'relation_type'] // для поиска дочерних блоков
    },
    {
      fields: ['child_block_id'] // для поиска родительских блоков
    },
    {
      fields: ['parent_block_id', 'order_index'] // для сортировки
    }
  ],
  
  // Валидация данных
  validate: {
    noSelfRelation() {
      if (this.parentBlockId === this.childBlockId) {
        throw new Error('Block cannot be related to itself');
      }
    }
  }
});

module.exports = BlockRelations;