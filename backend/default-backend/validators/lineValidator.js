// validators/lineValidator.js
const { isValidColor, validateMargin } = require('./colorValidator');
const { BLOCK_OPTIONS } = require('../constants/blockConstants');

const validateLineBlock = (data) => {
  const { style: validStyles, width: validWidths, heightRange } = BLOCK_OPTIONS.line;
  
  // Валидация стиля линии (если передан)
  if (data.style !== undefined && !validStyles.includes(data.style)) {
    throw new Error(`Invalid style: ${data.style}. Valid styles: ${validStyles.join(', ')}`);
  }
  
  // Валидация ширины линии (если передана)
  if (data.width !== undefined && !validWidths.includes(data.width)) {
    throw new Error(`Invalid width: ${data.width}. Valid widths: ${validWidths.join(', ')}`);
  }
  
  // Валидация высоты линии (если передана)
  if (data.height !== undefined && (typeof data.height !== 'number' || data.height < heightRange.min || data.height > heightRange.max)) {
    throw new Error(`height must be a number between ${heightRange.min} and ${heightRange.max} pixels`);
  }
  
  // Валидация цвета (если передан)
  if (data.color !== undefined && !isValidColor(data.color)) {
    throw new Error(`Invalid color format: ${data.color}. Use hex (#000000), rgb(0,0,0), hsl(0,0%,0%) or named colors`);
  }
  
  // Валидация отступов (если переданы)
  validateMargin(data.marginTop, 'marginTop');
  validateMargin(data.marginBottom, 'marginBottom');
};

module.exports = {
  validateLineBlock
};