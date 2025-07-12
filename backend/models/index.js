const News = require("./News");
const Events = require("./Events");
const Blocks = require("./Blocks");
const Pages = require("./Pages");
const TextTranslations = require("./TextTranslations");
const Texts = require("./Texts");
const sequelize = require("../db");
const ContactInfoItems = require("./ContactInfoItems");
const BlockRelations = require("./BlockRelations");

// Связи News с Texts
News.belongsTo(Texts, {
  foreignKey: "titleTextId",
  as: "titleText",
});
News.belongsTo(Texts, {
  foreignKey: "shortDescriptionTextId",
  as: "shortDescriptionText",
});
News.belongsTo(Texts, {
  foreignKey: "contentTextId",
  as: "contentText",
});

// Связи Events с Texts
Events.belongsTo(Texts, {
  foreignKey: "nameTextId",
  as: "nameText",
});
Events.belongsTo(Texts, {
  foreignKey: "descriptionTextId",
  as: "descriptionText",
});
Events.belongsTo(Texts, {
  foreignKey: "placeTextId",
  as: "placeText",
});

// Pages ↔ Blocks
Pages.hasMany(Blocks, {
  foreignKey: "pageId",
  as: "blocks",
  onDelete: "CASCADE",
});

Blocks.belongsTo(Pages, {
  foreignKey: "pageId",
  as: "page",
});

// Связи для блоков (родительские и дочерние)
Blocks.hasMany(BlockRelations, {
  foreignKey: "parentBlockId",
  as: "childRelations",
  onDelete: "CASCADE"
});

Blocks.hasMany(BlockRelations, {
  foreignKey: "childBlockId",
  as: "parentRelations",
  onDelete: "CASCADE"
});

BlockRelations.belongsTo(Blocks, {
  foreignKey: "parentBlockId",
  as: "parentBlock"
});

BlockRelations.belongsTo(Blocks, {
  foreignKey: "childBlockId",
  as: "childBlock"
});

// Обратные связи для News и Events
Texts.hasMany(News, {
  foreignKey: "titleTextId",
  as: "newsWithTitle",
});
Texts.hasMany(News, {
  foreignKey: "shortDescriptionTextId",
  as: "newsWithShortDescription",
});
Texts.hasMany(News, {
  foreignKey: "contentTextId",
  as: "newsWithContent",
});
Texts.hasMany(Events, {
  foreignKey: "nameTextId",
  as: "eventsWithName",
});
Texts.hasMany(Events, {
  foreignKey: "descriptionTextId",
  as: "eventsWithDescription",
});
Texts.hasMany(Events, {
  foreignKey: "placeTextId",
  as: "eventsWithPlace",
});

// Связи для переводов
Texts.hasMany(TextTranslations, {
  foreignKey: "textId",
  as: "translations",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

TextTranslations.belongsTo(Texts, {
  foreignKey: "textId",
  as: "text",
});

// Ассоциации для блоков контактной информации
Blocks.hasMany(ContactInfoItems, {
  foreignKey: 'blockId',
  as: 'contactInfoItems',
  onDelete: 'CASCADE'
});

ContactInfoItems.belongsTo(Blocks, {
  foreignKey: 'blockId',
  as: 'block'
});

module.exports = {
  News,
  Events,
  Blocks,
  Pages,
  Texts,
  TextTranslations,
  sequelize,
  ContactInfoItems,
  BlockRelations
};
