// validators/colorValidator.js
const { BLOCK_OPTIONS } = require("../constants/blockConstants");

const isValidColor = (color) => {
  if (!color || typeof color !== "string") return false;

  // Hex цвета: #000, #000000, #fff, #ffffff И #00000080, #D2AC2D80 (с альфа-каналом)
  const hexPattern = /^#([A-Fa-f0-9]{3}){1,2}([A-Fa-f0-9]{2})?$/;

  // RGB/RGBA цвета: rgb(255,255,255), rgba(255,255,255,0.5)
  const rgbPattern =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/;

  // HSL/HSLA цвета: hsl(360,100%,50%), hsla(360,100%,50%,0.5)
  const hslPattern =
    /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/;

  // Именованные цвета
  const namedColors = [
    "transparent",
    "black",
    "white",
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "gray",
    "grey",
    "brown",
    "cyan",
    "magenta",
    // Можно добавить больше именованных цветов
    "darkred",
    "darkgreen",
    "darkblue",
    "lightgray",
    "lightgrey",
    "silver",
    "maroon",
    "navy",
    "teal",
    "olive",
    "lime",
    "aqua",
    "fuchsia",
  ];

  // Дополнительная валидация для HEX с альфа-каналом
  if (hexPattern.test(color)) {
    // Проверяем, что RGB значения валидны (0-255 в hex = 00-FF)
    const hex = color.slice(1); // убираем #

    if (hex.length === 3 || hex.length === 4) {
      // Короткий формат: #RGB или #RGBA
      return true;
    } else if (hex.length === 6 || hex.length === 8) {
      // Полный формат: #RRGGBB или #RRGGBBAA
      return true;
    }
  }

  // Валидация RGB значений
  if (rgbPattern.test(color)) {
    const matches = color.match(rgbPattern);
    const [, r, g, b, a] = matches;

    // Проверяем, что RGB в диапазоне 0-255
    if (parseInt(r) > 255 || parseInt(g) > 255 || parseInt(b) > 255) {
      return false;
    }

    // Проверяем альфа-канал (0-1)
    if (a !== undefined && (parseFloat(a) < 0 || parseFloat(a) > 1)) {
      return false;
    }

    return true;
  }

  // Валидация HSL значений
  if (hslPattern.test(color)) {
    const matches = color.match(hslPattern);
    const [, h, s, l, a] = matches;

    // Проверяем диапазоны: H(0-360), S(0-100), L(0-100)
    if (parseInt(h) > 360 || parseInt(s) > 100 || parseInt(l) > 100) {
      return false;
    }

    // Проверяем альфа-канал (0-1)
    if (a !== undefined && (parseFloat(a) < 0 || parseFloat(a) > 1)) {
      return false;
    }

    return true;
  }

  return namedColors.includes(color.toLowerCase());
};

const validateMargin = (value, fieldName = "margin") => {
  const { min, max } = BLOCK_OPTIONS.title.marginRange;
  if (
    value !== undefined &&
    (typeof value !== "number" || value < min || value > max)
  ) {
    throw new Error(`${fieldName} must be a number between ${min} and ${max}`);
  }
};

// Дополнительная функция для проверки конкретных форматов
const getColorFormat = (color) => {
  if (!color || typeof color !== "string") return null;

  if (/^#([A-Fa-f0-9]{3}){1,2}([A-Fa-f0-9]{2})?$/.test(color)) {
    return color.length === 4
      ? "hex-short"
      : color.length === 7
      ? "hex"
      : color.length === 5
      ? "hex-short-alpha"
      : "hex-alpha";
  }

  if (/^rgba?\(/.test(color)) return color.includes("rgba") ? "rgba" : "rgb";
  if (/^hsla?\(/.test(color)) return color.includes("hsla") ? "hsla" : "hsl";

  const namedColors = [
    "transparent",
    "black",
    "white",
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "gray",
    "grey",
    "brown",
    "cyan",
    "magenta",
  ];
  if (namedColors.includes(color.toLowerCase())) return "named";

  return null;
};

module.exports = {
  isValidColor,
  validateMargin,
  getColorFormat,
};
