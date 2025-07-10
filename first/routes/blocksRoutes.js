const express = require("express");
const router = express.Router();
const blocksController = require("../controllers/blocksController");
const titleBlockRouter = require("./blocks/titleRoutes");
const lineBlockRoutes = require("./blocks/lineRoutes");
// Общие роуты для блоков
router.get("/page/:pageId", blocksController.getBlocksByPageId);
router.get("/:id", blocksController.getBlockById);
router.delete("/:id", blocksController.deleteBlock);

// Роуты для конкретных типов блоков
router.use("/title", titleBlockRouter);
router.use("/line", lineBlockRoutes);

module.exports = router;
