const express = require("express");
const contactInfoController = require("../../controllers/blocks/contactInfoController");
const { uploads } = require("../../middleware/contactsFilesUploadMiddleware");
const router = express.Router();

// === БЛОК КОНТАКТНОЙ ИНФОРМАЦИИ ===

/**
 * @route POST /api/blocks/contact-info
 * @desc Create contact info block
 * @body {number} pageId - ID страницы
 * @body {object} [title] - Заголовок блока {kz, ru, en}
 * @body {array} [items] - Массив элементов контактной информации
 * @body {object} [settings] - Настройки блока
 */
router.post("/", contactInfoController.createBlock);

/**
 * @route GET /api/blocks/contact-info/:id
 * @desc Get contact info block with items
 */
router.get("/:id", contactInfoController.getBlock);

/**
 * @route PUT /api/blocks/contact-info/:id
 * @desc Update contact info block
 * @body {object} [title] - Заголовок блока
 * @body {object} [settings] - Настройки блока
 */
router.put("/:id", contactInfoController.updateBlock);

/**
 * @route DELETE /api/blocks/contact-info/:id
 * @desc Delete contact info block
 */
router.delete("/:id", contactInfoController.deleteBlock);

// === ЭЛЕМЕНТЫ КОНТАКТНОЙ ИНФОРМАЦИИ ===

/**
 * @route POST /api/blocks/contact-info/:blockId/items
 * @desc Create contact info item
 * @body {string} type - Тип элемента (phone, email, file, etc.)
 * @body {string} icon - Иконка из Lucide
 * @body {object} texts - Тексты на разных языках {kz, ru, en}
 * @body {string} [value] - Значение (телефон, email, ссылка)
 * @body {string} [fileName] - Имя файла (для типа file)
 * @body {boolean} [downloadable] - Можно ли скачать (для файлов)
 * @body {object} [settings] - Дополнительные настройки
 */
router.post("/:blockId/items", uploads.contactInfo.single('file'), contactInfoController.createItem);

/**
 * @route PUT /api/blocks/contact-info/items/:id
 * @desc Update contact info item
 */
router.put("/items/:id", uploads.contactInfo.single('file'), contactInfoController.updateItem);

/**
 * @route DELETE /api/blocks/contact-info/items/:id
 * @desc Delete contact info item
 */
router.delete("/items/:id", contactInfoController.deleteItem);

/**
 * @route PUT /api/blocks/contact-info/:blockId/items/reorder
 * @desc Reorder contact info items
 * @body {array} itemsOrder - Массив объектов {id, order}
 */
router.put("/:blockId/items/reorder", contactInfoController.reorderItems);

// === ВСПОМОГАТЕЛЬНЫЕ РОУТЫ ===

/**
 * @route GET /api/blocks/contact-info/icons/available
 * @desc Get available Lucide icons
 */
router.get("/icons/available", contactInfoController.getAvailableIcons);

module.exports = router;