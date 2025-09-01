// config/blockTypesConfig.js
import TitleBlockForm from '../admin/components/blocks/forms/TitleBlockForm';
import LineBlockForm from '../admin/components/blocks/forms/LineBlockForm';
import ContactInfoBlockForm from '../admin/components/blocks/forms/ContactInfoBlockForm';
import FaqBlockForm from '../admin/components/blocks/forms/FaqBlockForm';
import TextImageBlockForm from '../admin/components/blocks/forms/TextImageBlockForm';
import ButtonBlockForm from '../admin/components/blocks/forms/ButtonBlockForm';
import TextBlockForm from '../admin/components/blocks/forms/TextBlockForm';
import ImageBlockForm from '../admin/components/blocks/forms/ImageBlockForm';

export const BLOCK_TYPES_CONFIG = {
  title: {
    name: 'Заголовок',
    description: 'Текстовый заголовок с поддержкой переводов',
    icon: '📝',
    category: 'content',
    hasTranslations: true,
    FormComponent: TitleBlockForm,
  },
  line: {
    name: 'Разделительная линия',
    description: 'Горизонтальная линия для разделения контента',
    icon: '📏',
    category: 'layout',
    hasTranslations: false,
    FormComponent: LineBlockForm,
  },
  'contact-info': {
    name: 'Контактная информация',
    description: 'Блок с контактными данными: телефоны, email, файлы',
    icon: '📞',
    category: 'content',
    hasTranslations: true,
    FormComponent: ContactInfoBlockForm,
  },
  faq: {
    name: 'FAQ (Вопрос-ответ)',
    description: 'Блок с вопросами и ответами, поддерживает любые блоки в качестве ответов',
    icon: '❓',
    category: 'interactive',
    hasTranslations: true,
    FormComponent: FaqBlockForm,
  },
  'text-image': {
    name: 'Текст с изображением',
    description: 'Блок с текстом и изображением, поддерживает позиционирование изображения слева или справа',
    icon: '📝🖼️',
    category: 'content',
    hasTranslations: true,
    FormComponent: TextImageBlockForm,
  },
  button: {
    name: 'Кнопка',
    description: 'Интерактивная кнопка с настраиваемым стилем и ссылкой',
    icon: '🔘',
    category: 'interactive',
    hasTranslations: true,
    FormComponent: ButtonBlockForm,
  },
  text: {
    name: 'Текст',
    description: 'Простой текстовый блок с настройками стилей',
    icon: '📄',
    category: 'content',
    hasTranslations: true,
    FormComponent: TextBlockForm,
  },
  image: {
    name: 'Изображения',
    description: 'Одно изображение, галерея или слайдер',
    icon: '🖼️',
    category: 'media',
    hasTranslations: false,
    FormComponent: ImageBlockForm,
  },
};

export const BLOCK_CATEGORIES = {
  content: {
    name: 'Контент',
    icon: '📝',
    description: 'Текстовый и медиа контент'
  },
  layout: {
    name: 'Макет',
    icon: '🏗️',
    description: 'Элементы макета и структуры'
  },
  media: {
    name: 'Медиа',
    icon: '🎨',
    description: 'Изображения, видео, галереи'
  },
  interactive: {
    name: 'Интерактивные',
    icon: '⚡',
    description: 'Формы, кнопки, интерактивные элементы'
  }
};

export const blockUtils = {
  // Получить все блоки по категориям
  getCategoriesWithBlocks: () => {
    const categoriesWithBlocks = {};
    
    Object.entries(BLOCK_CATEGORIES).forEach(([categoryKey, category]) => {
      const blocksInCategory = Object.entries(BLOCK_TYPES_CONFIG)
        .filter(([_, blockConfig]) => blockConfig.category === categoryKey)
        .map(([type, config]) => ({
          type,
          name: config.name,
          description: config.description,
          icon: config.icon
        }));
      
      if (blocksInCategory.length > 0) {
        categoriesWithBlocks[categoryKey] = {
          ...category,
          blocks: blocksInCategory
        };
      }
    });
    
    return categoriesWithBlocks;
  },

  // Получить конфигурацию блока по типу
  getBlockConfig: (type) => {
    return BLOCK_TYPES_CONFIG[type] || null;
  },

  // Проверить есть ли переводы у блока
  hasTranslations: (type) => {
    return BLOCK_TYPES_CONFIG[type]?.hasTranslations || false;
  },

  // Получить все типы блоков
  getAllBlockTypes: () => {
    return Object.keys(BLOCK_TYPES_CONFIG);
  },

  // Получить блоки по категории
  getBlocksByCategory: (category) => {
    return Object.entries(BLOCK_TYPES_CONFIG)
      .filter(([_, config]) => config.category === category)
      .map(([type, config]) => ({ type, ...config }));
  }
};