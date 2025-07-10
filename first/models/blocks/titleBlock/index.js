const { Blocks, Texts } = require("../../core");
const TitleData = require("./TitleData");

Blocks.hasOne(TitleData, {
  foreignKey: "blockId",
  as: "titleData",
});

TitleData.belongsTo(Blocks, {
  foreignKey: "blockId",
  as: "block",
});

TitleData.belongsTo(Texts, {
  foreignKey: "textId",
  as: "text",
});

Texts.hasOne(TitleData, {
  foreignKey: "textId",
  as: "titleData",
});

module.exports = {
  TitleData,
};
