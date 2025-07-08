const express = require('express');
const router = express.Router();
const titleBlockController = require('../../controllers/blocks/titleBlockController');

router.post('/', titleBlockController.create);
router.get('/options', titleBlockController.getOptions);
router.get('/:id', titleBlockController.getById);
router.put('/:id', titleBlockController.update);
router.delete('/:id', titleBlockController.delete);

module.exports = router;