const express = require("express");
const router = express.Router();
const blocksController = require("../controllers/blocksController");
const titleBlockRouter = require("./blocks/titleRoutes");
// Общие роуты для блоков
router.get("/page/:pageId", blocksController.getBlocksByPageId);
router.get("/:id", blocksController.getBlockById);
router.delete("/:id", blocksController.deleteBlock);

// Роуты для конкретных типов блоков
router.use("/title", titleBlockRouter);

module.exports = router;
