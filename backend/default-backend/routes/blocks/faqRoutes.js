const express = require("express");
const router = express.Router();
const Blocks = require("../../models/Blocks");
const { validateBlockData } = require("../../validators");

// Создать FAQ блок
router.post("/", async (req, res) => {
  try {
    const { pageId, type, data } = req.body;

    if (!pageId) {
      return res.status(400).json({ error: "pageId is required" });
    }

    if (type !== "faq") {
      return res.status(400).json({ error: "Invalid block type" });
    }

    // Валидация данных блока
    try {
      validateBlockData(type, data);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Создаем новый блок
    const newBlock = new Blocks({
      type,
      data,
      pageId,
      order: 0, // Будет обновлено при сохранении
    });

    // Получаем максимальный order для страницы
    const maxOrderBlock = await Blocks.findOne({ pageId }).sort({ order: -1 });
    newBlock.order = maxOrderBlock ? maxOrderBlock.order + 1 : 0;

    const savedBlock = await newBlock.save();
    res.status(201).json(savedBlock);
  } catch (error) {
    console.error("Error creating FAQ block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Обновить FAQ блок
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, data } = req.body;

    if (type !== "faq") {
      return res.status(400).json({ error: "Invalid block type" });
    }

    // Валидация данных блока
    try {
      validateBlockData(type, data);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const updatedBlock = await Blocks.findByIdAndUpdate(
      id,
      { type, data },
      { new: true, runValidators: true }
    );

    if (!updatedBlock) {
      return res.status(404).json({ error: "Block not found" });
    }

    res.json(updatedBlock);
  } catch (error) {
    console.error("Error updating FAQ block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Удалить FAQ блок
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlock = await Blocks.findByIdAndDelete(id);
    if (!deletedBlock) {
      return res.status(404).json({ error: "Block not found" });
    }

    res.json({ message: "Block deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Получить FAQ блок по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const block = await Blocks.findById(id);
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    res.json(block);
  } catch (error) {
    console.error("Error fetching FAQ block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;