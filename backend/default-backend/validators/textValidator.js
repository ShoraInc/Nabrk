const { BLOCK_OPTIONS } = require('../constants/blockConstants');

// Валидация отступов для text блока
const validateTextMargin = (value, fieldName) => {
  if (value === undefined) return; // Поле опциональное
  
  if (typeof value !== 'number') {
    throw new Error(`${fieldName} must be a number`);
  }
  
  const range = BLOCK_OPTIONS['text']?.marginRange;
  if (!range) {
    throw new Error('Text margin range not configured');
  }
  
  if (value < range.min || value > range.max) {
    throw new Error(`${fieldName} must be between ${range.min} and ${range.max}`);
  }
};

// Валидация размера шрифта
const validateFontSize = (fontSize, fieldName) => {
  if (fontSize === undefined) return; // Поле опциональное
  
  if (typeof fontSize !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  const allowedSizes = BLOCK_OPTIONS.text?.fontSizes;
  if (allowedSizes && !allowedSizes.includes(fontSize)) {
    throw new Error(`${fieldName} must be one of: ${allowedSizes.join(', ')}`);
  }
};

// Валидация толщины шрифта
const validateFontWeight = (fontWeight, fieldName) => {
  if (fontWeight === undefined) return; // Поле опциональное
  
  if (typeof fontWeight !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  const allowedWeights = BLOCK_OPTIONS.text?.fontWeights;
  if (allowedWeights && !allowedWeights.includes(fontWeight)) {
    throw new Error(`${fieldName} must be one of: ${allowedWeights.join(', ')}`);
  }
};

// Валидация цвета текста
const validateTextColor = (textColor, fieldName) => {
  if (textColor === undefined) return; // Поле опциональное
  
  if (typeof textColor !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  // Проверяем что это hex цвет
  if (!textColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
    throw new Error(`${fieldName} must be a valid hex color (e.g., #FF0000 or #F00)`);
  }
  
  const allowedColors = BLOCK_OPTIONS.text?.textColors;
  if (allowedColors && !allowedColors.includes(textColor)) {
    console.warn(`${fieldName} "${textColor}" is not in the predefined list, but will be accepted`);
  }
};

// Валидация выравнивания текста
const validateTextAlign = (textAlign, fieldName) => {
  if (textAlign === undefined) return; // Поле опциональное
  
  if (typeof textAlign !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  const allowedAligns = BLOCK_OPTIONS.text?.textAlign;
  if (allowedAligns && !allowedAligns.includes(textAlign)) {
    throw new Error(`${fieldName} must be one of: ${allowedAligns.join(', ')}`);
  }
};

const validateTextBlock = (data) => {
  // Валидация отступов
  validateTextMargin(data.marginTop, 'marginTop');
  validateTextMargin(data.marginBottom, 'marginBottom');
  
  // Валидация стилей текста
  validateFontSize(data.fontSize, 'fontSize');
  validateFontWeight(data.fontWeight, 'fontWeight');
  validateTextColor(data.textColor, 'textColor');
  validateTextAlign(data.textAlign, 'textAlign');

  // Валидация переводов (если переданы)
  if (data.translations) {
    if (typeof data.translations !== 'object') {
      throw new Error('translations must be an object');
    }
    
    // Проверяем что есть хотя бы один перевод
    const translationKeys = Object.keys(data.translations);
    if (translationKeys.length === 0) {
      throw new Error('At least one translation is required');
    }
    
    // Проверяем что переводы не пустые
    for (const [lang, text] of Object.entries(data.translations)) {
      if (!BLOCK_OPTIONS.languages.includes(lang)) {
        throw new Error(`Unsupported language: ${lang}. Valid languages: ${BLOCK_OPTIONS.languages.join(', ')}`);
      }
      
      if (typeof text !== 'string' || text.trim().length === 0) {
        throw new Error(`Translation for language '${lang}' must be a non-empty string`);
      }
    }
  }
};

module.exports = {
  validateTextBlock
};
