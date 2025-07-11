// config/blockTypesConfig.js
import React from 'react';

// Компоненты для отображения блоков в админке
import AdminTitleBlock from '../admin/components/blocks/admin/AdminTitleBlock';
import AdminLineBlock from '../admin/components/blocks/admin/AdminLineBlock';

// Формы для создания/редактирования блоков
import TitleBlockForm from '../admin/components/blocks/forms/TitleBlockForm';
import LineBlockForm from '../admin/components/blocks//forms/LineBlockForm';

// Конфигурация всех типов блоков
export const BLOCK_TYPES_CONFIG = {
  title: {
    name: 'Заголовок',
    description: 'Текстовый заголовок с поддержкой переводов',
    icon: '📝',
    category: 'text',
    hasTranslations: true,
    // Компонент для отображения в админке
    AdminComponent: AdminTitleBlock,
    // Форма для создания/редактирования
    FormComponent: TitleBlockForm,
    // Поля по умолчанию при создании
    defaultData: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333333',
      textAlign: 'left',
      marginTop: 0,
      marginBottom: 16,
    },
    // Валидация
    validation: {
      required: ['text'],
      rules: {
        text: { minLength: 1, maxLength: 500 }
      }
    }
  },

  line: {
    name: 'Линия',
    description: 'Горизонтальная разделительная линия',
    icon: '➖',
    category: 'separator',
    hasTranslations: false,
    AdminComponent: AdminLineBlock,
    FormComponent: LineBlockForm,
    defaultData: {
      color: '#000000',
      height: 1,
      width: '100%',
      style: 'solid',
      marginTop: 10,
      marginBottom: 10,
    },
    validation: {
      required: [],
      rules: {
        height: { min: 1, max: 20 },
        marginTop: { min: 0, max: 200 },
        marginBottom: { min: 0, max: 200 }
      }
    }
  },

  // Здесь в будущем добавим новые типы блоков:
  /*
  image: {
    name: 'Изображение',
    description: 'Блок с изображением',
    icon: '🖼️',
    category: 'media',
    hasTranslations: false,
    AdminComponent: AdminImageBlock,
    FormComponent: ImageBlockForm,
    defaultData: {
      alt: '',
      width: '100%',
      alignment: 'center'
    }
  },
  
  card: {
    name: 'Карточка',
    description: 'Карточка с заголовком и описанием',
    icon: '🃏',
    category: 'content',
    hasTranslations: true,
    AdminComponent: AdminCardBlock,
    FormComponent: CardBlockForm,
    defaultData: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '20px'
    }
  }
  */
};

// Категории блоков для группировки в UI
export const BLOCK_CATEGORIES = {
  text: {
    name: 'Текст',
    icon: '📝',
    color: '#3b82f6'
  },
  media: {
    name: 'Медиа',
    icon: '🖼️',
    color: '#10b981'
  },
  content: {
    name: 'Контент',
    icon: '📄',
    color: '#8b5cf6'
  },
  separator: {
    name: 'Разделители',
    icon: '➖',
    color: '#6b7280'
  },
  layout: {
    name: 'Макет',
    icon: '📐',
    color: '#f59e0b'
  }
};

// Утилиты для работы с конфигурацией
export const blockUtils = {
  // Получить конфигурацию типа блока
  getBlockConfig: (type) => {
    return BLOCK_TYPES_CONFIG[type] || null;
  },

  // Получить все доступные типы блоков
  getAllBlockTypes: () => {
    return Object.keys(BLOCK_TYPES_CONFIG);
  },

  // Получить блоки по категории
  getBlocksByCategory: (category) => {
    return Object.entries(BLOCK_TYPES_CONFIG)
      .filter(([type, config]) => config.category === category)
      .map(([type, config]) => ({ type, ...config }));
  },

  // Получить все категории с блоками
  getCategoriesWithBlocks: () => {
    const result = {};
    Object.entries(BLOCK_CATEGORIES).forEach(([categoryKey, categoryInfo]) => {
      const blocks = blockUtils.getBlocksByCategory(categoryKey);
      if (blocks.length > 0) {
        result[categoryKey] = {
          ...categoryInfo,
          blocks
        };
      }
    });
    return result;
  },

  // Валидация данных блока
  validateBlockData: (type, data) => {
    const config = blockUtils.getBlockConfig(type);
    if (!config) return { valid: false, errors: ['Unknown block type'] };

    const errors = [];
    const { required = [], rules = {} } = config.validation;

    // Проверка обязательных полей
    required.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        errors.push(`Field '${field}' is required`);
      }
    });

    // Проверка правил валидации
    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      if (value !== undefined && value !== null) {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`Field '${field}' must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`Field '${field}' must be no more than ${rule.maxLength} characters`);
        }
        if (rule.min && value < rule.min) {
          errors.push(`Field '${field}' must be at least ${rule.min}`);
        }
        if (rule.max && value > rule.max) {
          errors.push(`Field '${field}' must be no more than ${rule.max}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
};