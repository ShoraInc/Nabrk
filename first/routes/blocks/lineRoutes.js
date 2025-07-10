const express = require('express');
const router = express.Router();
const lineBlockController = require('../../controllers/blocks/lineBlockController');

/**
 * @route POST /api/blocks/line
 * @desc Create line block
 * @body {number} pageId - Page ID
 * @body {number} [order=0] - Block order
 * @body {string} [color=#000000] - Line color
 * @body {number} [height=1] - Line height in pixels
 * @body {string} [width=100%] - Line width (25%, 50%, 75%, 100%)
 * @body {string} [style=solid] - Line style (solid, dashed, dotted)
 * @body {number} [marginTop=10] - Top margin
 * @body {number} [marginBottom=10] - Bottom margin
 */
router.post('/', lineBlockController.create);

/**
 * @route GET /api/blocks/line/options
 * @desc Get available options for line block
 */
router.get('/options', lineBlockController.getOptions);

/**
 * @route GET /api/blocks/line/:id
 * @desc Get line block by ID
 */
router.get('/:id', lineBlockController.getById);

/**
 * @route PUT /api/blocks/line/:id
 * @desc Update line block properties
 * @body {number} [order] - Block order
 * @body {string} [color] - Line color
 * @body {number} [height] - Line height in pixels
 * @body {string} [width] - Line width
 * @body {string} [style] - Line style
 * @body {number} [marginTop] - Top margin
 * @body {number} [marginBottom] - Bottom margin
 */
router.put('/:id', lineBlockController.update);

/**
 * @route DELETE /api/blocks/line/:id
 * @desc Delete line block completely
 */
router.delete('/:id', lineBlockController.delete);

module.exports = router;