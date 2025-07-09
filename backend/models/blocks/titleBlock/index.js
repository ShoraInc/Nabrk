const { Blocks, Texts, TextTranslations } = require("../../core");
const TitleData = require("./TitleData");

// Связки для titleBlock С CASCADE
Blocks.hasOne(TitleData, {
  foreignKey: "blockId",
  as: "titleData",
  onDelete: "CASCADE",
});

TitleData.belongsTo(Blocks, {
  foreignKey: "blockId",
  as: "block",
});

// Связки для переводов С CASCADE
TitleData.belongsTo(Texts, {
  foreignKey: "textId",
  as: "text",
});

Texts.hasOne(TitleData, {
  foreignKey: "textId",
  as: "titleData",
  onDelete: "CASCADE",
});

module.exports = {
  TitleData,
};
