const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const { checkSlugUnique, validatePageData } = require("../middleware/pagesMiddleware");

// GET /pages - Получить все страницы
router.get("/", pagesController.getAllPages);

// GET /pages/:id - Получить страницу по ID
router.get("/:id", pagesController.getPageById);

// POST /pages - Создать новую страницу (с валидацией)
router.post("/", validatePageData, checkSlugUnique, pagesController.createPage);

// PUT /pages/:id - Обновить страницу по ID (с валидацией)
router.put("/:id", validatePageData, checkSlugUnique, pagesController.updatePage);

// DELETE /pages/:id - Удалить страницу по ID
router.delete("/:id", pagesController.deletePage);

module.exports = router;