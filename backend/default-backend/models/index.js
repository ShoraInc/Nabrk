const News = require("./News");
const Events = require("./Events");
const Blocks = require("./Blocks");
const Pages = require("./Pages");
const TextTranslations = require("./TextTranslations");
const Texts = require("./Texts");
const Question = require("./Question");
const Answers = require("./Answers");
const Types = require("./Types");
const sequelize = require("../db");
const ContactInfoItems = require("./ContactInfoItems");
const BlockRelations = require("./BlockRelations");
const Menu = require("./Menu");

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

// ===== Q&A associations =====
// Types -> Texts (title)
Types.belongsTo(Texts, { foreignKey: 'titleId', as: 'text' });
Texts.hasMany(Types, { foreignKey: 'titleId', as: 'types' });

// Question -> Answers (1:1 or 1:M depending; we'll use 1:1 latest answer)
Question.hasOne(Answers, { foreignKey: 'questionId', as: 'Answer', onDelete: 'CASCADE' });
Answers.belongsTo(Question, { foreignKey: 'questionId', as: 'Question' });

// Answers -> Types
Answers.belongsTo(Types, { foreignKey: 'typeId', as: 'Type' });
Types.hasMany(Answers, { foreignKey: 'typeId', as: 'answers' });

module.exports = {
  News,
  Events,
  Blocks,
  Pages,
  Texts,
  TextTranslations,
  sequelize,
  ContactInfoItems,
  BlockRelations,
  Question,
  Answers,
  Types,
  Menu
};
