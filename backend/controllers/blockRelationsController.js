const { BlockRelations, Blocks, Pages } = require("../models");
const { Op } = require("sequelize");

// Добавить дочерний блок к родительскому
const addChildBlock = async (req, res) => {
  try {
    const { id: parentBlockId } = req.params;
    const { childBlockId, relationType = "faq_answer", orderIndex } = req.body;

    if (!childBlockId) {
      return res.status(400).json({ error: "childBlockId is required" });
    }

    // Проверяем существование родительского блока
    const parentBlock = await Blocks.findByPk(parentBlockId);
    if (!parentBlock) {
      return res.status(404).json({ error: "Parent block not found" });
    }

    // Проверяем существование дочернего блока
    const childBlock = await Blocks.findByPk(childBlockId);
    if (!childBlock) {
      return res.status(404).json({ error: "Child block not found" });
    }

    // Проверяем, что оба блока находятся на одной странице
    if (parentBlock.pageId !== childBlock.pageId) {
      return res.status(400).json({ 
        error: "Blocks must be on the same page" 
      });
    }

    // Проверяем, что связь не существует
    const existingRelation = await BlockRelations.findOne({
      where: {
        parentBlockId,
        childBlockId,
        relationType
      }
    });

    if (existingRelation) {
      return res.status(400).json({ 
        error: "Relation already exists" 
      });
    }

    // Определяем orderIndex если не указан
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const maxOrder = await BlockRelations.max('orderIndex', {
        where: { parentBlockId, relationType }
      });
      finalOrderIndex = (maxOrder || -1) + 1;
    }

    // Создаем связь
    const relation = await BlockRelations.create({
      parentBlockId,
      childBlockId,
      relationType,
      orderIndex: finalOrderIndex
    });

    res.status(201).json({
      message: "Child block added successfully",
      relation
    });
  } catch (error) {
    console.error("Error adding child block:", error);
    res.status(500).json({ error: error.message });
  }
};

// Получить все дочерние блоки
const getChildBlocks = async (req, res) => {
  try {
    const { id: parentBlockId } = req.params;
    const { relationType = "faq_answer" } = req.query;

    // Проверяем существование родительского блока
    const parentBlock = await Blocks.findByPk(parentBlockId);
    if (!parentBlock) {
      return res.status(404).json({ error: "Parent block not found" });
    }

    // Получаем все дочерние блоки с их данными
    const relations = await BlockRelations.findAll({
      where: {
        parentBlockId,
        relationType
      },
      include: [
        {
          model: Blocks,
          as: "childBlock",
          include: [
            {
              model: require("../models").ContactInfoItems,
              as: "contactInfoItems"
            }
          ]
        }
      ],
      order: [["orderIndex", "ASC"]]
    });

    // Форматируем ответ
    const childBlocks = relations.map(relation => ({
      relationId: relation.id,
      orderIndex: relation.orderIndex,
      relationType: relation.relationType,
      block: relation.childBlock
    }));

    res.json({
      parentBlock: {
        id: parentBlock.id,
        type: parentBlock.type,
        pageId: parentBlock.pageId
      },
      childBlocks,
      total: childBlocks.length
    });
  } catch (error) {
    console.error("Error getting child blocks:", error);
    res.status(500).json({ error: error.message });
  }
};

// Удалить связь
const removeChildBlock = async (req, res) => {
  try {
    const { parentId, childId } = req.params;
    const { relationType = "faq_answer" } = req.query;

    // Проверяем существование связи
    const relation = await BlockRelations.findOne({
      where: {
        parentBlockId: parentId,
        childBlockId: childId,
        relationType
      }
    });

    if (!relation) {
      return res.status(404).json({ error: "Relation not found" });
    }

    // Удаляем связь
    await relation.destroy();

    res.json({
      message: "Child block removed successfully"
    });
  } catch (error) {
    console.error("Error removing child block:", error);
    res.status(500).json({ error: error.message });
  }
};

// Изменить порядок дочерних блоков
const updateChildBlockOrder = async (req, res) => {
  try {
    const { parentId, childId } = req.params;
    const { orderIndex, relationType = "faq_answer" } = req.body;

    if (orderIndex === undefined) {
      return res.status(400).json({ error: "orderIndex is required" });
    }

    // Проверяем существование связи
    const relation = await BlockRelations.findOne({
      where: {
        parentBlockId: parentId,
        childBlockId: childId,
        relationType
      }
    });

    if (!relation) {
      return res.status(404).json({ error: "Relation not found" });
    }

    // Обновляем порядок
    await relation.update({ orderIndex });

    res.json({
      message: "Child block order updated successfully",
      relation
    });
  } catch (error) {
    console.error("Error updating child block order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Получить все родительские блоки для дочернего
const getParentBlocks = async (req, res) => {
  try {
    const { childId } = req.params;
    const { relationType } = req.query;

    const whereClause = { childBlockId: childId };
    if (relationType) {
      whereClause.relationType = relationType;
    }

    const relations = await BlockRelations.findAll({
      where: whereClause,
      include: [
        {
          model: Blocks,
          as: "parentBlock"
        }
      ],
      order: [["orderIndex", "ASC"]]
    });

    const parentBlocks = relations.map(relation => ({
      relationId: relation.id,
      orderIndex: relation.orderIndex,
      relationType: relation.relationType,
      block: relation.parentBlock
    }));

    res.json({
      childBlockId: childId,
      parentBlocks,
      total: parentBlocks.length
    });
  } catch (error) {
    console.error("Error getting parent blocks:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addChildBlock,
  getChildBlocks,
  removeChildBlock,
  updateChildBlockOrder,
  getParentBlocks
};