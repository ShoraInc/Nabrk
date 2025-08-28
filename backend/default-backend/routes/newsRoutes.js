const express = require("express");
const router = express.Router();
const { uploadContentImage, handleUploadError, processUploadedImage } = require("../middleware/uploadMiddleware");
const {
    getAllNews,
    getNewsById,
    createNewsDraft,
    updateNews,
    getNewsTranslations,
    addNewsTranslation,
    updateNewsTranslation,
    deleteNewsTranslation,
    publishNews,
    unpublishNews,
    getNewsDrafts,
    deleteNews
} = require("../controllers/newsController");

/**
 * @route GET /api/news
 * @desc Get all published news
 * @query {string} [lang=ru] - Language code
 * @query {number} [page=1] - Page number
 * @query {number} [limit=10] - Items per page
 */
router.get("/", getAllNews);

/**
 * @route GET /api/news/drafts
 * @desc Get all news drafts
 * @query {string} [lang=ru] - Language code
 */
router.get("/drafts", getNewsDrafts);

/**
 * @route GET /api/news/:id
 * @desc Get single news by ID
 * @query {string} [lang=ru] - Language code
 */
router.get("/:id", getNewsById);

/**
 * @route GET /api/news/:id/translations
 * @desc Get all translations for news
 */
router.get("/:id/translations", getNewsTranslations);

/**
 * @route POST /api/news/draft
 * @desc Create news draft with image
 * @body {string} title - News title
 * @body {string} content - News content
 * @body {string} [shortDescription] - Short description
 * @body {File} [image] - Image file (max 5MB, formats: JPG, PNG, WebP, GIF)
 * @body {string} [language=ru] - Primary language
 */
router.post("/draft", 
    uploadContentImage, 
    handleUploadError, 
    processUploadedImage, 
    createNewsDraft
);

/**
 * @route PUT /api/news/:id
 * @desc Update news (including image)
 * @body {File} [image] - New image file (max 5MB, formats: JPG, PNG, WebP, GIF)
 */
router.put("/:id", 
    uploadContentImage, 
    handleUploadError, 
    processUploadedImage, 
    updateNews
);

/**
 * @route POST /api/news/:id/translations/:lang
 * @desc Add translation for specific language
 * @body {string} title - Translated title
 * @body {string} content - Translated content
 * @body {string} [shortDescription] - Translated short description
 */
router.post("/:id/translations/:lang", addNewsTranslation);

/**
 * @route PUT /api/news/:id/translations/:lang
 * @desc Update translation for specific language
 * @body {string} [title] - Updated title
 * @body {string} [content] - Updated content
 * @body {string} [shortDescription] - Updated short description
 */
router.put("/:id/translations/:lang", updateNewsTranslation);

/**
 * @route PUT /api/news/:id/publish
 * @desc Publish news
 */
router.put("/:id/publish", publishNews);

/**
 * @route PUT /api/news/:id/unpublish
 * @desc Unpublish news
 */
router.put("/:id/unpublish", unpublishNews);

/**
 * @route DELETE /api/news/:id/translations/:lang
 * @desc Delete translation for specific language
 */
router.delete("/:id/translations/:lang", deleteNewsTranslation);

/**
 * @route DELETE /api/news/:id
 * @desc Delete news completely
 */
router.delete("/:id", deleteNews);

module.exports = router;