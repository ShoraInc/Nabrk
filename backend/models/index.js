const sequelize = require("../db");

// Импортируем все модули
const core = require('./core');
const content = require('./content'); 
const blocks = require('./blocks');

module.exports = {
    sequelize,
    ...core,
    ...content,
    ...blocks
};