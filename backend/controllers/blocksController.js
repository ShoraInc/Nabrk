const { Blocks } = require('../models');

const blocksController = {
    // Получить все блоки страницы
    getBlocksByPageId: async (req, res) => {
        try {
            const blocks = await Blocks.findAll({
                where: { pageId: req.params.pageId },
                order: [['order', 'ASC']]
            });
            res.json(blocks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить блок по ID
    getBlockById: async (req, res) => {
        try {
            const block = await Blocks.findByPk(req.params.id);
            
            if (!block) {
                return res.status(404).json({ error: 'Block not found' });
            }
            
            res.json(block);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить блок
    deleteBlock: async (req, res) => {
        try {
            const deleted = await Blocks.destroy({
                where: { id: req.params.id }
            });
            
            if (!deleted) {
                return res.status(404).json({ error: 'Block not found' });
            }
            
            res.json({ message: 'Block deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = blocksController;