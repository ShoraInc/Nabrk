const { Blocks } = require('../../core');
const TitleData = require('./TitleData');

// Связки только для titleBlock
Blocks.hasOne(TitleData, {
    foreignKey: 'blockId',
    as: 'titleData'
});

TitleData.belongsTo(Blocks, {
    foreignKey: 'blockId',
    as: 'block'
});

module.exports = {
    TitleData
};