const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

router.get('/', questionsController.getAll);
router.post('/', questionsController.create);
router.delete('/:id', questionsController.remove);

module.exports = router;


