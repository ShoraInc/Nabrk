const { validateColor } = require("./colorValidator");

const validateFaqBlock = (data) => {
  const errors = [];

  // Проверяем наличие переводов
  if (!data.translations || typeof data.translations !== 'object') {
    errors.push('FAQ block must have translations object');
  } else {
    // Проверяем, что есть хотя бы один перевод
    const hasTranslation = Object.values(data.translations).some(
      translation => translation && typeof translation === 'string' && translation.trim().length > 0
    );
    
    if (!hasTranslation) {
      errors.push('FAQ block must have at least one non-empty translation');
    }
  }

  // Проверяем настройки
  if (data.settings) {
    // Проверяем isExpanded
    if (data.settings.isExpanded !== undefined && typeof data.settings.isExpanded !== 'boolean') {
      errors.push('isExpanded must be a boolean');
    }

    // Проверяем animation
    if (data.settings.animation) {
      const validAnimations = ['slide', 'fade', 'none'];
      if (!validAnimations.includes(data.settings.animation)) {
        errors.push(`Invalid animation type. Must be one of: ${validAnimations.join(', ')}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`FAQ block validation failed: ${errors.join(', ')}`);
  }

  return true;
};

module.exports = {
  validateFaqBlock,
};