const { Blocks } = require("../../core");
const LineData = require("./LineData");

Blocks.hasOne(LineData, {
  foreignKey: "blockId",
  as: "lineData",
  onDelete: "CASCADE",
});

LineData.belongsTo(Blocks, {
  foreignKey: "blockId",
  as: "block",
});

module.exports = {
  LineData,
};