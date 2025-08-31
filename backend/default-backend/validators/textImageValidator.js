// validators/textImageValidator.js
const { BLOCK_OPTIONS } = require('../constants/blockConstants');

// Специальная функция валидации отступов для text-image блоков
const validateTextImageMargin = (value, fieldName = "margin") => {
    const { min, max } = BLOCK_OPTIONS['text-image'].marginRange;
    if (
        value !== undefined &&
        (typeof value !== "number" || value < min || value > max)
    ) {
        throw new Error(`${fieldName} must be a number between ${min} and ${max}`);
    }
};

const validateTextImageBlock = (data) => {
    const { imagePosition: validPositions } = BLOCK_OPTIONS['text-image'];

    // Валидация позиции изображения (если передана)
    if (data.imagePosition !== undefined && !validPositions.includes(data.imagePosition)) {
        throw new Error(`Invalid imagePosition: ${data.imagePosition}. Valid positions: ${validPositions.join(', ')}`);
    }

    // Валидация отступов (если переданы)
    validateTextImageMargin(data.marginTop, 'marginTop');
    validateTextImageMargin(data.marginBottom, 'marginBottom');

    // Валидация переводов (если переданы)
    if (data.translations) {
        if (typeof data.translations !== 'object') {
            throw new Error('translations must be an object');
        }

        // Проверяем что есть хотя бы один перевод
        const translationKeys = Object.keys(data.translations);
        if (translationKeys.length === 0) {
            throw new Error('At least one translation is required');
        }

        // Проверяем что переводы не пустые
        for (const [lang, text] of Object.entries(data.translations)) {
            if (!BLOCK_OPTIONS.languages.includes(lang)) {
                throw new Error(`Unsupported language: ${lang}. Valid languages: ${BLOCK_OPTIONS.languages.join(', ')}`);
            }

            if (typeof text !== 'string' || text.trim().length === 0) {
                throw new Error(`Translation for language '${lang}' must be a non-empty string`);
            }
        }
    }

    // Валидация путей к изображению (если переданы)
    if (data.imagePath !== undefined && data.imagePath !== null) {
        if (typeof data.imagePath !== 'string') {
            throw new Error('imagePath must be a string');
        }
    }

    if (data.imageUrl !== undefined && data.imageUrl !== null) {
        if (typeof data.imageUrl !== 'string') {
            throw new Error('imageUrl must be a string');
        }
    }
};

module.exports = {
    validateTextImageBlock
};
