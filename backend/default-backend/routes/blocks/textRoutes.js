const express = require('express');
const textController = require('../../controllers/blocks/textController');

const router = express.Router();

// Создать text блок
router.post('/', textController.create);

// Получить text блок по ID
router.get('/:id', textController.getById);

// Обновить text блок
router.put('/:id', textController.update);

// Удалить text блок
router.delete('/:id', textController.delete);

// Добавить/обновить перевод
router.put('/:id/translations/:lang', textController.upsertTranslation);

// Получить все переводы блока
router.get('/:id/translations', textController.getTranslations);

// Удалить перевод
router.delete('/:id/translations/:lang', textController.deleteTranslation);

module.exports = router;
