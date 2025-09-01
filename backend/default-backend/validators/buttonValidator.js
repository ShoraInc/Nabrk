// validators/buttonValidator.js
const { validateMargin } = require('./colorValidator');
const { BLOCK_OPTIONS } = require('../constants/blockConstants');

// Специальная функция валидации отступов для button блоков
const validateButtonMargin = (value, fieldName = "margin") => {
  const { min, max } = BLOCK_OPTIONS.button.marginRange;
  if (
    value !== undefined &&
    (typeof value !== "number" || value < min || value > max)
  ) {
    throw new Error(`${fieldName} must be a number between ${min} and ${max}`);
  }
};

// Валидация цвета
const validateColor = (color, fieldName = "color") => {
  if (color !== undefined && color !== null) {
    if (typeof color !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }
    // Простая проверка hex цвета
    if (!color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      throw new Error(`${fieldName} must be a valid hex color (e.g., #FF0000 or #F00)`);
    }
  }
};

// Валидация ширины
const validateWidth = (width, fieldName = "width") => {
  if (width !== undefined && width !== null) {
    if (typeof width !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }
    // Проверяем что это процент от 1% до 100%
    const percentMatch = width.match(/^(\d+)%$/);
    if (!percentMatch) {
      throw new Error(`${fieldName} must be a percentage (e.g., "50%")`);
    }
    const percent = parseInt(percentMatch[1]);
    if (percent < 1 || percent > 100) {
      throw new Error(`${fieldName} must be between 1% and 100%`);
    }
  }
};

// Валидация URL
const validateUrl = (url, fieldName = "url") => {
  if (url !== undefined && url !== null && url !== '') {
    if (typeof url !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }
    // Простая проверка URL
    try {
      new URL(url);
    } catch (error) {
      // Проверим относительные пути
      if (!url.startsWith('/') && !url.startsWith('#')) {
        throw new Error(`${fieldName} must be a valid URL or relative path`);
      }
    }
  }
};

const validateButtonBlock = (data) => {
  // Валидация отступов (если переданы)
  validateButtonMargin(data.marginTop, 'marginTop');
  validateButtonMargin(data.marginBottom, 'marginBottom');
  
  // Валидация цветов
  validateColor(data.backgroundColor, 'backgroundColor');
  validateColor(data.textColor, 'textColor');
  
  // Валидация ширины
  validateWidth(data.width, 'width');
  
  // Валидация URL
  validateUrl(data.url, 'url');
  
  // Валидация fontWeight (если передан)
  if (data.fontWeight !== undefined) {
    if (typeof data.fontWeight !== 'string') {
      throw new Error('fontWeight must be a string');
    }
    
    const allowedFontWeights = BLOCK_OPTIONS.button?.fontWeights;
    if (allowedFontWeights && !allowedFontWeights.includes(data.fontWeight)) {
      throw new Error(`fontWeight must be one of: ${allowedFontWeights.join(', ')}`);
    }
  }

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
  validateButtonBlock
};
