// validators/colorValidator.js
const { BLOCK_OPTIONS } = require('../constants/blockConstants');

const isValidColor = (color) => {
  if (!color || typeof color !== 'string') return false;
  
  // Hex цвета: #000, #000000, #fff, #ffffff
  const hexPattern = /^#([A-Fa-f0-9]{3}){1,2}$/;
  
  // RGB/RGBA цвета: rgb(255,255,255), rgba(255,255,255,0.5)
  const rgbPattern = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/;
  
  // HSL/HSLA цвета: hsl(360,100%,50%), hsla(360,100%,50%,0.5)
  const hslPattern = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/;
  
  // Именованные цвета
  const namedColors = [
    'transparent', 'black', 'white', 'red', 'green', 'blue', 'yellow', 
    'orange', 'purple', 'pink', 'gray', 'grey', 'brown', 'cyan', 'magenta'
  ];
  
  return hexPattern.test(color) || 
         rgbPattern.test(color) || 
         hslPattern.test(color) ||
         namedColors.includes(color.toLowerCase());
};

const validateMargin = (value, fieldName = 'margin') => {
  const { min, max } = BLOCK_OPTIONS.title.marginRange;
  
  if (value !== undefined && (typeof value !== 'number' || value < min || value > max)) {
    throw new Error(`${fieldName} must be a number between ${min} and ${max}`);
  }
};

module.exports = {
  isValidColor,
  validateMargin
};
