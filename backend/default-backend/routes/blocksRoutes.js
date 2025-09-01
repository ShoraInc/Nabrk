const express = require("express");
const router = express.Router();
const blocksController = require("../controllers/blocksController");

// Подключаем отдельные роутеры для каждого типа блока
const titleRoutes = require("./blocks/titleRoutes");
const lineRoutes = require("./blocks/lineRoutes");
const contactInfoRoutes = require("./blocks/contactInfoRoutes");
const textImageRoutes = require("./blocks/textImageRoutes");
const buttonRoutes = require("./blocks/buttonRoutes");
const textRoutes = require("./blocks/textRoutes");
const imageRoutes = require("./blocks/imageRoutes");

// ВАЖНО: /options должен быть ПЕРЕД /:id чтобы избежать конфликта роутов
/**
 * @route GET /api/blocks/options
 * @desc Get available options for all block types
 */
router.get("/options", blocksController.getBlockOptions);

// Общие роуты для всех блоков
/**
 * @route GET /api/blocks/page/:slug
 * @desc Get all blocks for a page by slug
 * @query {string} [lang=kz] - Language for translations
 */
router.get("/page/:slug", blocksController.getBlocksByPageSlug);

/**
 * @route GET /api/blocks/page-id/:pageId
 * @desc Get all blocks for a page by ID
 * @query {string} [lang=kz] - Language for translations
 */
router.get("/page-id/:pageId", blocksController.getBlocksByPageId);

/**
 * @route GET /api/blocks/:id
 * @desc Get any block by ID with texts (universal)
 * @query {string} [lang=kz] - Language for translations
 */
router.get("/:id", blocksController.getBlockById);

/**
 * @route DELETE /api/blocks/:id
 * @desc Delete any block by ID (universal)
 */
router.delete("/:id", blocksController.deleteBlock);

/**
 * @route GET /api/blocks/:blockId/used-in-faq
 * @desc Проверить, используется ли блок как ответ в FAQ
 */
router.get('/:blockId/used-in-faq', blocksController.isBlockUsedInFaq);

// Роуты для конкретных типов блоков
/**
 * Title block routes:
 * POST   /api/blocks/title          - Create title block
 * GET    /api/blocks/title/:id      - Get title block
 * PUT    /api/blocks/title/:id      - Update title block
 * DELETE /api/blocks/title/:id      - Delete title block
 * PUT    /api/blocks/title/:id/translations/:lang - Manage translations
 */
router.use("/title", titleRoutes);

/**
 * Line block routes:
 * POST   /api/blocks/line           - Create line block
 * GET    /api/blocks/line/:id       - Get line block
 * PUT    /api/blocks/line/:id       - Update line block
 * DELETE /api/blocks/line/:id       - Delete line block
 */
router.use("/line", lineRoutes);

/**
 * Contact Info block routes:
 * POST   /api/blocks/contact-info                    - Create contact info block
 * GET    /api/blocks/contact-info/:id                - Get contact info block
 * PUT    /api/blocks/contact-info/:id                - Update contact info block
 * DELETE /api/blocks/contact-info/:id                - Delete contact info block
 * POST   /api/blocks/contact-info/:blockId/items     - Create contact item
 * PUT    /api/blocks/contact-info/items/:id          - Update contact item
 * DELETE /api/blocks/contact-info/items/:id          - Delete contact item
 * PUT    /api/blocks/contact-info/:blockId/items/reorder - Reorder items
 * GET    /api/blocks/contact-info/icons/available    - Get available icons
 */
router.use("/contact-info", contactInfoRoutes);

/**
 * Text-Image block routes:
 * POST   /api/blocks/text-image                      - Create text-image block (with image upload)
 * GET    /api/blocks/text-image/:id                  - Get text-image block
 * PUT    /api/blocks/text-image/:id                  - Update text-image block (with image upload)
 * DELETE /api/blocks/text-image/:id                  - Delete text-image block (removes image file)
 * PUT    /api/blocks/text-image/:id/translations/:lang - Manage translations
 * GET    /api/blocks/text-image/:id/translations     - Get all translations
 * DELETE /api/blocks/text-image/:id/translations/:lang - Delete translation
 */
router.use("/text-image", textImageRoutes);

/**
 * Button block routes:
 * POST   /api/blocks/button                          - Create button block
 * GET    /api/blocks/button/:id                      - Get button block
 * PUT    /api/blocks/button/:id                      - Update button block
 * DELETE /api/blocks/button/:id                      - Delete button block
 * PUT    /api/blocks/button/:id/translations/:lang   - Manage translations
 * GET    /api/blocks/button/:id/translations         - Get all translations
 * DELETE /api/blocks/button/:id/translations/:lang   - Delete translation
 */
router.use("/button", buttonRoutes);
router.post("/faq", blocksController.createFaqBlock);

/**
 * FAQ block routes:
 * POST   /api/blocks/faq            - Create FAQ block
 * PUT    /api/blocks/faq/:id        - Update FAQ block
 */
router.post("/faq", blocksController.createFaqBlock);
router.put("/faq/:id", blocksController.updateFaqBlock);

// Роуты для новых типов блоков
router.use("/text-image", textImageRoutes);
router.use("/button", buttonRoutes);
router.use("/text", textRoutes);
router.use("/image", imageRoutes);
// router.use("/card", cardRoutes);

module.exports = router;