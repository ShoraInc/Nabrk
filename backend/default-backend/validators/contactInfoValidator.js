// Валидатор для блока контактной информации
const { BLOCK_OPTIONS } = require('../constants/blockConstants');

const validateContactInfoBlock = (data) => {
  if (!data || typeof data !== "object") {
    throw new Error("Contact info block data must be an object");
  }

  // title опциональный
  if (data.title && typeof data.title !== "object") {
    throw new Error("Contact info title must be an object with translations");
  }

  // settings опциональный
  if (data.settings && typeof data.settings !== "object") {
    throw new Error("Contact info settings must be an object");
  }

  // Валидируем структуру title если он есть
  if (data.title) {
    const validLanguages = ['kz', 'ru', 'en'];
    const titleKeys = Object.keys(data.title);
    
    if (titleKeys.length === 0) {
      throw new Error("Title object cannot be empty");
    }

    titleKeys.forEach(lang => {
      if (!validLanguages.includes(lang)) {
        throw new Error(`Invalid language "${lang}" in title. Allowed: ${validLanguages.join(', ')}`);
      }
      
      if (typeof data.title[lang] !== 'string') {
        throw new Error(`Title for language "${lang}" must be a string`);
      }
    });
  }

  // Валидируем настройки если они есть
  if (data.settings) {
    const validSettings = ['showTitle', 'itemSpacing', 'iconSize'];
    const settingsKeys = Object.keys(data.settings);
    
    settingsKeys.forEach(key => {
      if (!validSettings.includes(key)) {
        console.warn(`Unknown setting "${key}" in contact info block`);
      }
    });

    // Валидируем конкретные настройки
    if (data.settings.showTitle !== undefined && typeof data.settings.showTitle !== 'boolean') {
      throw new Error('Setting "showTitle" must be a boolean');
    }

    if (data.settings.itemSpacing && !['compact', 'normal', 'spacious'].includes(data.settings.itemSpacing)) {
      throw new Error('Setting "itemSpacing" must be one of: compact, normal, spacious');
    }

    if (data.settings.iconSize && !['small', 'medium', 'large'].includes(data.settings.iconSize)) {
      throw new Error('Setting "iconSize" must be one of: small, medium, large');
    }
  }

  // Валидируем backgroundColor если он есть
  if (data.backgroundColor !== undefined) {
    if (typeof data.backgroundColor !== 'string') {
      throw new Error('backgroundColor must be a string');
    }
    
    // Проверяем что это hex цвет
    if (!data.backgroundColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      throw new Error('backgroundColor must be a valid hex color (e.g., #FF0000 or #F00)');
    }
    
    // Проверяем что цвет из разрешенного списка (опционально)
    if (BLOCK_OPTIONS['contact-info']?.backgroundColors) {
      const allowedColors = BLOCK_OPTIONS['contact-info'].backgroundColors;
      if (!allowedColors.includes(data.backgroundColor)) {
        console.warn(`backgroundColor "${data.backgroundColor}" is not in the predefined list, but will be accepted`);
      }
    }
  }
};

module.exports = {
  validateContactInfoBlock
};