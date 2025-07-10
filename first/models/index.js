
// Импортируем все модули
const core = require('./core');
const content = require('./content'); 
const blocks = require('./blocks');
const sequelize = require('../db');

module.exports = {
    sequelize,
    ...core,
    ...content,
    ...blocks
};