const express = require("express");
const router = express.Router();
const blocksController = require("../controllers/blocksController");

// Подключаем отдельные роутеры для каждого типа блока
const titleRoutes = require("./blocks/titleRoutes");
const lineRoutes = require("./blocks/lineRoutes");
const contactInfoRoutes = require("./blocks/contactInfoRoutes");

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
 * FAQ block routes:
 * POST   /api/blocks/faq            - Create FAQ block
 * PUT    /api/blocks/faq/:id        - Update FAQ block
 */
router.post("/faq", blocksController.createFaqBlock);
router.put("/faq/:id", blocksController.updateFaqBlock);

// Здесь будем добавлять новые типы блоков:
// router.use("/card", cardRoutes);
// router.use("/image", imageRoutes);

module.exports = router;