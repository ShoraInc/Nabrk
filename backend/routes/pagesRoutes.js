const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');

router.get('/', pagesController.getAllPages);
router.get('/:id', pagesController.getPageById);
router.post('/', pagesController.createPage);
router.put('/:id', pagesController.updatePage);
router.delete('/:id', pagesController.deletePage);

module.exports = router;