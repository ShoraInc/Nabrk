const { BLOCK_OPTIONS } = require('../constants/blockConstants');

// Валидация отступов для image блока
const validateImageMargin = (value, fieldName) => {
  if (value === undefined) return; // Поле опциональное
  
  if (typeof value !== 'number') {
    throw new Error(`${fieldName} must be a number`);
  }
  
  const range = BLOCK_OPTIONS['image']?.marginRange;
  if (!range) {
    throw new Error('Image margin range not configured');
  }
  
  if (value < range.min || value > range.max) {
    throw new Error(`${fieldName} must be between ${range.min} and ${range.max}`);
  }
};

// Валидация режима отображения
const validateDisplayMode = (displayMode, fieldName) => {
  if (displayMode === undefined) return; // Поле опциональное
  
  if (typeof displayMode !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  const allowedModes = BLOCK_OPTIONS.image?.displayModes;
  if (allowedModes && !allowedModes.includes(displayMode)) {
    throw new Error(`${fieldName} must be one of: ${allowedModes.join(', ')}`);
  }
};

// Валидация соотношения сторон
const validateAspectRatio = (aspectRatio, fieldName) => {
  if (aspectRatio === undefined) return; // Поле опциональное
  
  if (typeof aspectRatio !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  const allowedRatios = BLOCK_OPTIONS.image?.aspectRatios;
  if (allowedRatios && !allowedRatios.includes(aspectRatio)) {
    throw new Error(`${fieldName} must be one of: ${allowedRatios.join(', ')}`);
  }
};

// Валидация выравнивания
const validateAlignment = (alignment, fieldName) => {
  if (alignment === undefined) return; // Поле опциональное
  
  if (typeof alignment !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  
  const allowedAlignments = BLOCK_OPTIONS.image?.alignments;
  if (allowedAlignments && !allowedAlignments.includes(alignment)) {
    throw new Error(`${fieldName} must be one of: ${allowedAlignments.join(', ')}`);
  }
};

// Валидация настроек слайдера
const validateSliderOptions = (sliderOptions, fieldName) => {
  if (sliderOptions === undefined) return; // Поле опциональное
  
  if (typeof sliderOptions !== 'object') {
    throw new Error(`${fieldName} must be an object`);
  }
  
  const allowedOptions = BLOCK_OPTIONS.image?.sliderOptions;
  if (!allowedOptions) return;
  
  // Валидация autoPlay
  if (sliderOptions.autoPlay !== undefined) {
    if (typeof sliderOptions.autoPlay !== 'boolean') {
      throw new Error(`${fieldName}.autoPlay must be a boolean`);
    }
  }
  
  // Валидация showDots
  if (sliderOptions.showDots !== undefined) {
    if (typeof sliderOptions.showDots !== 'boolean') {
      throw new Error(`${fieldName}.showDots must be a boolean`);
    }
  }
  
  // Валидация showArrows
  if (sliderOptions.showArrows !== undefined) {
    if (typeof sliderOptions.showArrows !== 'boolean') {
      throw new Error(`${fieldName}.showArrows must be a boolean`);
    }
  }
  
  // Валидация slideSpeed
  if (sliderOptions.slideSpeed !== undefined) {
    if (typeof sliderOptions.slideSpeed !== 'number') {
      throw new Error(`${fieldName}.slideSpeed must be a number`);
    }
    
    if (allowedOptions.slideSpeed && !allowedOptions.slideSpeed.includes(sliderOptions.slideSpeed)) {
      throw new Error(`${fieldName}.slideSpeed must be one of: ${allowedOptions.slideSpeed.join(', ')}`);
    }
  }
};

// Валидация массива изображений
const validateImages = (images, fieldName) => {
  if (images === undefined || images === null) return; // Поле опциональное
  
  if (!Array.isArray(images)) {
    throw new Error(`${fieldName} must be an array`);
  }
  
  const maxImages = BLOCK_OPTIONS.image?.maxImages || 10;
  if (images.length > maxImages) {
    throw new Error(`${fieldName} cannot contain more than ${maxImages} images`);
  }
  
  // Валидация каждого изображения
  images.forEach((image, index) => {
    if (typeof image !== 'object') {
      throw new Error(`${fieldName}[${index}] must be an object`);
    }
    
    // Проверяем обязательные поля
    if (!image.url && !image.path) {
      throw new Error(`${fieldName}[${index}] must have either 'url' or 'path' field`);
    }
    
    // Валидация alt текста (опционально)
    if (image.alt !== undefined && typeof image.alt !== 'string') {
      throw new Error(`${fieldName}[${index}].alt must be a string`);
    }
    
    // Валидация заголовка (опционально)
    if (image.caption !== undefined && typeof image.caption !== 'string') {
      throw new Error(`${fieldName}[${index}].caption must be a string`);
    }
  });
};

const validateImageBlock = (data) => {
  // Валидация отступов
  validateImageMargin(data.marginTop, 'marginTop');
  validateImageMargin(data.marginBottom, 'marginBottom');
  
  // Валидация настроек отображения
  validateDisplayMode(data.displayMode, 'displayMode');
  validateAspectRatio(data.aspectRatio, 'aspectRatio');
  validateAlignment(data.alignment, 'alignment');
  
  // Валидация настроек слайдера
  validateSliderOptions(data.sliderOptions, 'sliderOptions');
  
  // Валидация изображений
  validateImages(data.images, 'images');
  
  // Проверяем что есть хотя бы одно изображение
  if (data.images && data.images.length === 0) {
    throw new Error('At least one image is required');
  }
};

module.exports = {
  validateImageBlock
};
