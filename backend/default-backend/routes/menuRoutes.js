const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// Получить всю структуру меню
router.get("/", menuController.getMenu);

// Создать пункт меню
router.post("/", menuController.createMenuItem);

// Обновить пункт меню
router.put("/:id", menuController.updateMenuItem);

// Удалить пункт меню
router.delete("/:id", menuController.deleteMenuItem);

// Поиск страниц
router.get("/search-pages", menuController.searchPages);

// Получить страницу по slug
router.get("/page/:slug", menuController.getPageBySlug);

module.exports = router;
