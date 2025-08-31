const express = require("express");
const router = express.Router();
const buttonController = require("../../controllers/blocks/buttonController");

/**
 * @route POST /api/blocks/button
 * @desc Create button block
 * @body {pageId, text, language, url, width, backgroundColor, textColor, marginTop, marginBottom, isHidden}
 */
router.post("/", buttonController.create);

/**
 * @route GET /api/blocks/button/:id
 * @desc Get button block by ID
 */
router.get("/:id", buttonController.getById);

/**
 * @route PUT /api/blocks/button/:id
 * @desc Update button block
 * @body {order, url, width, backgroundColor, textColor, marginTop, marginBottom, isHidden}
 */
router.put("/:id", buttonController.update);

/**
 * @route DELETE /api/blocks/button/:id
 * @desc Delete button block
 */
router.delete("/:id", buttonController.delete);

// ROUTES FOR TRANSLATIONS
/**
 * @route PUT /api/blocks/button/:id/translations/:lang
 * @desc Create or update translation for button block
 * @body {text}
 * @param {string} lang - Language code (en, ru, kz)
 */
router.put("/:id/translations/:lang", buttonController.upsertTranslation);

/**
 * @route GET /api/blocks/button/:id/translations
 * @desc Get all translations for button block
 */
router.get("/:id/translations", buttonController.getTranslations);

/**
 * @route DELETE /api/blocks/button/:id/translations/:lang
 * @desc Delete specific translation for button block
 * @param {string} lang - Language code (en, ru, kz)
 */
router.delete("/:id/translations/:lang", buttonController.deleteTranslation);

module.exports = router;
