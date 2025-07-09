const { Blocks, Texts } = require("../../core");
const TitleData = require("./TitleData");

// Связки для titleBlock с CASCADE удалением
Blocks.hasOne(TitleData, {
  foreignKey: "blockId",
  as: "titleData",
  onDelete: "CASCADE", // При удалении блока удаляется TitleData
  onUpdate: "CASCADE",
});

TitleData.belongsTo(Blocks, {
  foreignKey: "blockId",
  as: "block",
});

// Связки для переводов с CASCADE удалением
TitleData.belongsTo(Texts, {
  foreignKey: "textId",
  as: "text",
  onDelete: "CASCADE", // При удалении TitleData удаляется Texts
  onUpdate: "CASCADE",
});

Texts.hasOne(TitleData, {
  foreignKey: "textId",
  as: "titleData",
});

module.exports = {
  TitleData,
};
