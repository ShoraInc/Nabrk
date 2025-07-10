const express = require('express');
const router = express.Router();
const titleController = require('../../controllers/blocks/titleController');

/**
 * @route POST /api/blocks/title
 * @desc Create title block
 * @body {number} pageId - Page ID
 * @body {string} text - Text content (required)
 * @body {number} [order=0] - Block order
 * @body {string} [language=kz] - Language for initial translation
 * @body {string} [fontSize=16px] - Font size
 * @body {string} [fontWeight=400] - Font weight
 * @body {string} [color=#000000] - Text color
 * @body {string} [textAlign=left] - Text alignment
 * @body {number} [marginTop=0] - Top margin
 * @body {number} [marginBottom=0] - Bottom margin
 */
router.post('/', titleController.create);

/**
 * @route GET /api/blocks/title/:id
 * @desc Get title block by ID
 */
router.get('/:id', titleController.getById);

/**
 * @route PUT /api/blocks/title/:id
 * @desc Update title block properties (styles, not text content)
 * @body {number} [order] - Block order
 * @body {string} [fontSize] - Font size
 * @body {string} [fontWeight] - Font weight
 * @body {string} [color] - Text color
 * @body {string} [textAlign] - Text alignment
 * @body {number} [marginTop] - Top margin
 * @body {number} [marginBottom] - Bottom margin
 */
router.put('/:id', titleController.update);

/**
 * @route DELETE /api/blocks/title/:id
 * @desc Delete title block completely
 */
router.delete('/:id', titleController.delete);

/**
 * @route GET /api/blocks/title/:id/translations
 * @desc Get all translations for title block
 * @returns {object} Object with blockId and translations
 */
router.get('/:id/translations', titleController.getTranslations);

/**
 * @route PUT /api/blocks/title/:id/translations/:lang
 * @desc Create or update translation for specific language
 * @body {string} text - Text content for translation
 * @returns {object} Translation object with _meta.action: 'created' | 'updated'
 * @status 201 if created, 200 if updated
 */
router.put('/:id/translations/:lang', titleController.upsertTranslation);

/**
 * @route DELETE /api/blocks/title/:id/translations/:lang
 * @desc Delete translation for specific language
 */
router.delete('/:id/translations/:lang', titleController.deleteTranslation);

module.exports = router;