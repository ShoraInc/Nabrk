const sequelize = require("../db");

// Import models
const Texts = require("./Texts");
const TextTranslations = require("./TextTranslations");
const News = require("./News");
const Events = require("./Events");

// Define associations

// Texts and TextTranslations
Texts.hasMany(TextTranslations, {
    foreignKey: 'textId',
    as: 'translations',
    onDelete: 'CASCADE'
});

TextTranslations.belongsTo(Texts, {
    foreignKey: 'textId',
    as: 'text'
});

// News associations with Texts
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

// Events associations with Texts
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

// Reverse associations (optional, for easier querying)
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
    sequelize,
    Texts,
    TextTranslations,
    News,
    Events
};