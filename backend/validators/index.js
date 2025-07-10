// validators/index.js
const { validateTitleBlock } = require("./titleValidator");
const { validateLineBlock } = require("./lineValidator");

const validateBlockData = (blockType, data) => {
  if (!data || typeof data !== "object") {
    throw new Error(`Block data must be an object, received: ${typeof data}`);
  }

  switch (blockType) {
    case "title":
      validateTitleBlock(data);
      break;

    case "line":
      validateLineBlock(data);
      break;

    default:
      throw new Error(`Unknown block type: ${blockType}`);
  }
};

module.exports = {
  validateBlockData
};