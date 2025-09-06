const express = require('express');
const router = express.Router();
const answersController = require('../controllers/answersController');

router.get('/', answersController.getAll);
router.post('/', answersController.create);
router.put('/:id', answersController.update);
router.delete('/:id', answersController.remove);
router.put('/:id/publish', answersController.publish);
router.put('/:id/unpublish', answersController.unpublish);

module.exports = router;


