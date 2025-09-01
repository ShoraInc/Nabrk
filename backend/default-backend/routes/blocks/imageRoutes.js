const express = require('express');
const router = express.Router();
const imageController = require('../../controllers/blocks/imageController');
const { 
  uploadMultipleBlockImages, 
  handleBlockImageUploadError, 
  processMultipleBlockImages 
} = require('../../middleware/blockImageUploadMiddleware');

// Создание нового image блока
router.post('/', (req, res, next) => {
  uploadMultipleBlockImages(req, res, (err) => {
    if (err) {
      return handleBlockImageUploadError(err, req, res, next);
    }
    
    // Обрабатываем каждое загруженное изображение
    if (req.files && req.files.length > 0) {
      processMultipleBlockImages(req.files, req);
    }
    
    next();
  });
}, imageController.create);

// Получение image блока по ID
router.get('/:id', imageController.getById);

// Обновление image блока
router.put('/:id', (req, res, next) => {
  uploadMultipleBlockImages(req, res, (err) => {
    if (err) {
      return handleBlockImageUploadError(err, req, res, next);
    }
    
    // Обрабатываем каждое загруженное изображение
    if (req.files && req.files.length > 0) {
      processMultipleBlockImages(req.files, req);
    }
    
    next();
  });
}, imageController.update);

// Удаление image блока
router.delete('/:id', imageController.delete);

module.exports = router;
