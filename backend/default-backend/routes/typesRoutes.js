const express = require('express');
const router = express.Router();
const typesController = require('../controllers/typesController');

router.get('/', typesController.get);
router.post('/', typesController.create);
router.patch('/:id', typesController.update);
router.delete('/:id', typesController.remove);

module.exports = router;


