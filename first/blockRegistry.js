// blockRegistry.js
const blockRegistry = {};

// Функция для регистрации блока
const registerBlock = (type, config) => {
  blockRegistry[type] = config;
};

// Функция для получения конфигурации блока
const getBlockConfig = (type) => {
  return blockRegistry[type];
};

// Функция для получения всех зарегистрированных блоков
const getAllBlockConfigs = () => {
  return blockRegistry;
};

// Функция для формирования include на основе типа блока
const getIncludeForBlockType = (type) => {
  const config = blockRegistry[type];
  if (!config) return null;
  
  const include = {
    model: config.model,
    as: config.as,
  };
  
  // Если есть вложенные includes
  if (config.includes && config.includes.length > 0) {
    include.include = config.includes;
  }
  
  return include;
};

// Функция для формирования includes для массива типов блоков
const getIncludesForBlockTypes = (types) => {
  const includes = [];
  
  types.forEach(type => {
    const include = getIncludeForBlockType(type);
    if (include) {
      includes.push(include);
    }
  });
  
  return includes;
};

module.exports = {
  registerBlock,
  getBlockConfig,
  getAllBlockConfigs,
  getIncludeForBlockType,
  getIncludesForBlockTypes
};