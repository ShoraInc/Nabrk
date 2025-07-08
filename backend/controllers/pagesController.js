const { Pages, Blocks } = require('../models');

const pagesController = {
    // Получить все страницы
    getAllPages: async (req, res) => {
        try {
            const pages = await Pages.findAll({
                include: [{
                    model: Blocks,
                    as: 'blocks',
                    order: [['order', 'ASC']]
                }]
            });
            res.json(pages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить страницу по ID
    getPageById: async (req, res) => {
        try {
            const page = await Pages.findByPk(req.params.id, {
                include: [{
                    model: Blocks,
                    as: 'blocks',
                    order: [['order', 'ASC']]
                }]
            });
            
            if (!page) {
                return res.status(404).json({ error: 'Page not found' });
            }
            
            res.json(page);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Создать страницу
    createPage: async (req, res) => {
        try {
            const { title, slug, status } = req.body;
            const page = await Pages.create({ title, slug, status });
            res.status(201).json(page);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Обновить страницу
    updatePage: async (req, res) => {
        try {
            const { title, slug, status } = req.body;
            const [updated] = await Pages.update(
                { title, slug, status },
                { where: { id: req.params.id } }
            );
            
            if (!updated) {
                return res.status(404).json({ error: 'Page not found' });
            }
            
            const page = await Pages.findByPk(req.params.id);
            res.json(page);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить страницу
    deletePage: async (req, res) => {
        try {
            const deleted = await Pages.destroy({
                where: { id: req.params.id }
            });
            
            if (!deleted) {
                return res.status(404).json({ error: 'Page not found' });
            }
            
            res.json({ message: 'Page deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = pagesController;