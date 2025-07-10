// blocksInit.js - здесь регистрируем все блоки
const { registerBlock } = require("./blockRegistry");
const { Texts, TextTranslations, TitleData, LineData } = require("./models");

// Регистрируем блок title
registerBlock("title", {
  model: TitleData,
  as: "titleData",
  includes: [
    {
      model: Texts,
      as: "text",
      include: [
        {
          model: TextTranslations,
          as: "translations",
        },
      ],
    },
  ],
});

// Регистрируем блок line
registerBlock("line", {
  model: LineData,
  as: "lineData",
});

module.exports = {};
