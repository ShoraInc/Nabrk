const express = require("express");
const router = express.Router();
const textImageController = require("../../controllers/blocks/textImageController");
const { uploadBlockImage, handleBlockImageUploadError, processBlockImage } = require("../../middleware/blockImageUploadMiddleware");

// ВАЖНО: /options должен быть ПЕРЕД /:id чтобы избежать конфликта роутов

/**
 * @route POST /api/blocks/text-image
 * @desc Create text-image block with optional image upload
 * @body {pageId, text, language, imagePosition, marginTop, marginBottom, isHidden}
 * @file image (optional)
 */
router.post("/", 
  uploadBlockImage,           // Загрузка изображения
  handleBlockImageUploadError, // Обработка ошибок загрузки
  processBlockImage,          // Обработка загруженного изображения
  textImageController.create  // Создание блока
);

/**
 * @route GET /api/blocks/text-image/:id
 * @desc Get text-image block by ID
 */
router.get("/:id", textImageController.getById);

/**
 * @route PUT /api/blocks/text-image/:id
 * @desc Update text-image block (styles and image)
 * @body {order, imagePosition, marginTop, marginBottom, isHidden}
 * @file image (optional - для замены изображения)
 */
router.put("/:id", 
  uploadBlockImage,           // Загрузка нового изображения (если есть)
  handleBlockImageUploadError, // Обработка ошибок загрузки
  processBlockImage,          // Обработка загруженного изображения
  textImageController.update  // Обновление блока
);

/**
 * @route DELETE /api/blocks/text-image/:id
 * @desc Delete text-image block (включая файл изображения)
 */
router.delete("/:id", textImageController.delete);

// ROUTES FOR TRANSLATIONS
/**
 * @route PUT /api/blocks/text-image/:id/translations/:lang
 * @desc Create or update translation for text-image block
 * @body {text}
 * @param {string} lang - Language code (kz, ru, en, qaz)
 */
router.put("/:id/translations/:lang", textImageController.upsertTranslation);

/**
 * @route GET /api/blocks/text-image/:id/translations
 * @desc Get all translations for text-image block
 */
router.get("/:id/translations", textImageController.getTranslations);

/**
 * @route DELETE /api/blocks/text-image/:id/translations/:lang
 * @desc Delete specific translation for text-image block
 * @param {string} lang - Language code (kz, ru, en, qaz)
 */
router.delete("/:id/translations/:lang", textImageController.deleteTranslation);

module.exports = router;
