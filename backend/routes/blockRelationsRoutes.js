const express = require("express");
const router = express.Router();
const blockRelationsController = require("../controllers/blockRelationsController");

// Добавить дочерний блок к родительскому
router.post("/:id/relations", blockRelationsController.addChildBlock);

// Получить все дочерние блоки
router.get("/:id/children", blockRelationsController.getChildBlocks);

// Удалить связь
router.delete("/:parentId/relations/:childId", blockRelationsController.removeChildBlock);

// Изменить порядок дочерних блоков
router.put("/:parentId/relations/:childId", blockRelationsController.updateChildBlockOrder);

// Получить все родительские блоки для дочернего
router.get("/:childId/parents", blockRelationsController.getParentBlocks);

module.exports = router;