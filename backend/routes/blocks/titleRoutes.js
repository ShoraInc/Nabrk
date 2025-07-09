const express = require('express');
const router = express.Router();
const titleBlockController = require('../../controllers/blocks/titleBlockController');

/**
 * @route POST /api/blocks/title
 * @desc Create title block with initial translation
 * @body {number} pageId - Page ID
 * @body {number} [order=0] - Block order
 * @body {string} text - Text content
 * @body {string} [language=kz] - Language code for initial translation
 * @body {string} [textAlign=left] - Text alignment
 * @body {string} [fontWeight=400] - Font weight
 * @body {string} [fontSize=16px] - Font size
 * @body {string} [color=#000000] - Text color
 * @body {number} [marginTop=0] - Top margin
 * @body {number} [marginBottom=0] - Bottom margin
 */
router.post('/', titleBlockController.create);

/**
 * @route GET /api/blocks/title/options
 * @desc Get available options for title block
 */
router.get('/options', titleBlockController.getOptions);

/**
 * @route GET /api/blocks/title/:id
 * @desc Get title block by ID
 * @query {string} [lang=kz] - Language code for translation
 */
router.get('/:id', titleBlockController.getById);

/**
 * @route GET /api/blocks/title/:id/translations
 * @desc Get all translations for title block
 */
router.get('/:id/translations', titleBlockController.getTranslations);

/**
 * @route PUT /api/blocks/title/:id
 * @desc Update title block properties (not text)
 * @body {number} [order] - Block order
 * @body {string} [textAlign] - Text alignment
 * @body {string} [fontWeight] - Font weight
 * @body {string} [fontSize] - Font size
 * @body {string} [color] - Text color
 * @body {number} [marginTop] - Top margin
 * @body {number} [marginBottom] - Bottom margin
 */
router.put('/:id', titleBlockController.update);

/**
 * @route POST /api/blocks/title/:id/translations/:lang
 * @desc Add translation for specific language
 * @body {string} text - Translated text content
 */
router.post('/:id/translations/:lang', titleBlockController.addTranslation);

/**
 * @route PUT /api/blocks/title/:id/translations/:lang
 * @desc Update translation for specific language
 * @body {string} text - Updated text content
 */
router.put('/:id/translations/:lang', titleBlockController.updateTranslation);

/**
 * @route DELETE /api/blocks/title/:id/translations/:lang
 * @desc Delete translation for specific language
 */
router.delete('/:id/translations/:lang', titleBlockController.deleteTranslation);

/**
 * @route DELETE /api/blocks/title/:id
 * @desc Delete title block completely
 */
router.delete('/:id', titleBlockController.delete);

module.exports = router;