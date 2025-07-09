const Texts = require("./Texts");
const TextTranslations = require("./TextTranslations");
const Pages = require("./Pages");
const Blocks = require("./Blocks");

// Связки между Texts и TextTranslations с CASCADE
Texts.hasMany(TextTranslations, {
  foreignKey: "textId",
  as: "translations",
  onDelete: "CASCADE", // При удалении Texts удаляются все переводы
  onUpdate: "CASCADE",
});

TextTranslations.belongsTo(Texts, {
  foreignKey: "textId",
  as: "text",
});

Pages.hasMany(Blocks, {
  foreignKey: "pageId",
  as: "blocks",
});

Blocks.belongsTo(Pages, {
  foreignKey: "pageId",
  as: "page",
});

module.exports = {
  Texts,
  TextTranslations,
  Pages,
  Blocks,
};
