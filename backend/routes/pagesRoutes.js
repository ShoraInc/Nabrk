const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const {
  checkSlugUnique,
  validatePageData,
  normalizeSlug,
} = require("../middleware/pagesMiddleware");

// ===========================================
// ПУБЛИЧНЫЕ МАРШРУТЫ (только published страницы)
// ===========================================

/**
 * @route GET /api/pages/public
 * @desc Get only published pages (for users)
 */
router.get("/public", pagesController.getPublishedPages);

/**
 * @route GET /api/pages/public/:slug
 * @desc Get published page by slug (for users)
 */
router.get("/public/:slug", pagesController.getPublishedPageBySlug);

// ===========================================
// АДМИНСКИЕ МАРШРУТЫ (все страницы)
// ===========================================

/**
 * @route GET /api/pages/admin/stats
 * @desc Get pages statistics (admin only)
 */
router.get("/admin/stats", pagesController.getPagesStats);

/**
 * @route GET /api/pages/admin
 * @desc Get all pages including drafts (admin only)
 */
router.get("/admin", pagesController.getAllPagesAdmin);

/**
 * @route GET /api/pages/admin/:id
 * @desc Get page by ID regardless of status (admin only)
 */
router.get("/admin/:id", pagesController.getPageByIdAdmin);

/**
 * @route POST /api/pages/admin
 * @desc Create new page (admin only)
 */
router.post(
  "/admin",
  normalizeSlug,
  validatePageData,
  checkSlugUnique,
  pagesController.createPage
);

/**
 * @route PUT /api/pages/admin/:id
 * @desc Update page by ID (admin only)
 */
router.put(
  "/admin/:id",
  normalizeSlug,
  validatePageData,
  checkSlugUnique,
  pagesController.updatePage
);

/**
 * @route POST /api/pages/admin/:id/publish
 * @desc Publish page (admin only)
 */
router.post("/admin/:id/publish", pagesController.publishPage);

/**
 * @route POST /api/pages/admin/:id/unpublish
 * @desc Unpublish page (admin only)
 */
router.post("/admin/:id/unpublish", pagesController.unpublishPage);

/**
 * @route DELETE /api/pages/admin/:id
 * @desc Delete page by ID (admin only)
 * @query {boolean} [force=false] - Force delete published page
 */
router.delete("/admin/:id", pagesController.deletePage);

module.exports = router;