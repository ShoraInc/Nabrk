// validators/titleValidator.js
const { isValidColor, validateMargin } = require('./colorValidator');
const { BLOCK_OPTIONS } = require('../constants/blockConstants');

const validateTitleBlock = (data) => {
  const { fontSize: validFontSizes, fontWeight: validFontWeights, textAlign: validTextAligns } = BLOCK_OPTIONS.title;
  
  // Валидация размера шрифта (если передан)
  if (data.fontSize !== undefined && !validFontSizes.includes(data.fontSize)) {
    throw new Error(`Invalid fontSize: ${data.fontSize}. Valid sizes: ${validFontSizes.join(', ')}`);
  }
  
  // Валидация веса шрифта (если передан)
  if (data.fontWeight !== undefined && !validFontWeights.includes(data.fontWeight)) {
    throw new Error(`Invalid fontWeight: ${data.fontWeight}. Valid weights: ${validFontWeights.join(', ')}`);
  }
  
  // Валидация выравнивания текста (если передан)
  if (data.textAlign !== undefined && !validTextAligns.includes(data.textAlign)) {
    throw new Error(`Invalid textAlign: ${data.textAlign}. Valid alignments: ${validTextAligns.join(', ')}`);
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
  validateTitleBlock
};
