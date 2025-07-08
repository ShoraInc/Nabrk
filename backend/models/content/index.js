const { Texts } = require('../core');
const News = require('./News');
const Events = require('./Events');

// Связи News с Texts
News.belongsTo(Texts, {
    foreignKey: 'titleTextId',
    as: 'titleText'
});

News.belongsTo(Texts, {
    foreignKey: 'shortDescriptionTextId',
    as: 'shortDescriptionText'
});

News.belongsTo(Texts, {
    foreignKey: 'contentTextId',
    as: 'contentText'
});

// Связи Events с Texts
Events.belongsTo(Texts, {
    foreignKey: 'nameTextId',
    as: 'nameText'
});

Events.belongsTo(Texts, {
    foreignKey: 'descriptionTextId',
    as: 'descriptionText'
});

Events.belongsTo(Texts, {
    foreignKey: 'placeTextId',
    as: 'placeText'
});

// Обратные связи
Texts.hasMany(News, {
    foreignKey: 'titleTextId',
    as: 'newsWithTitle'
});

Texts.hasMany(News, {
    foreignKey: 'shortDescriptionTextId',
    as: 'newsWithShortDescription'
});

Texts.hasMany(News, {
    foreignKey: 'contentTextId',
    as: 'newsWithContent'
});

Texts.hasMany(Events, {
    foreignKey: 'nameTextId',
    as: 'eventsWithName'
});

Texts.hasMany(Events, {
    foreignKey: 'descriptionTextId',
    as: 'eventsWithDescription'
});

Texts.hasMany(Events, {
    foreignKey: 'placeTextId',
    as: 'eventsWithPlace'
});

module.exports = {
    News,
    Events
};