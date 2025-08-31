const { validateTitleBlock } = require("./titleValidator");
const { validateLineBlock } = require("./lineValidator");
const { validateContactInfoBlock } = require("./contactInfoValidator");
const { validateFaqBlock } = require("./faqValidator");
const { validateTextImageBlock } = require("./textImageValidator");
const { validateButtonBlock } = require("./buttonValidator");

// Основная функция валидации блоков
const validateBlockData = (type, data) => {
  switch (type) {
    case "title":
      return validateTitleBlock(data);
      
    case "line":
      return validateLineBlock(data);
      
    case "contact-info":
      return validateContactInfoBlock(data);
      
    case "faq":
      return validateFaqBlock(data);
      
    case "text-image":
      return validateTextImageBlock(data);
      
    case "button":
      return validateButtonBlock(data);
      
    case "card":
    case "image":
      // Пока что пропускаем валидацию для этих типов
      console.warn(`Validation not implemented for block type: ${type}`);
      break;
      
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

module.exports = {
  validateBlockData,
};