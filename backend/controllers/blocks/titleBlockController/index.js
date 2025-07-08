const { Blocks, TitleData, sequelize } = require('../../../models');

const titleBlockController = {
    // Создать title блок
    create: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { 
                pageId, 
                order, 
                text, 
                textAlign, 
                fontWeight, 
                fontSize, 
                color, 
                marginTop, 
                marginBottom 
            } = req.body;

            // Проверяем существует ли страница
            const { Pages } = require('../../../models');
            const page = await Pages.findByPk(pageId);
            if (!page) {
                await transaction.rollback();
                return res.status(400).json({ 
                    error: `Page with ID ${pageId} does not exist` 
                });
            }

            // Создаем основной блок в транзакции
            const block = await Blocks.create({
                pageId,
                type: 'title',
                order: order || 0
            }, { transaction });

            // Создаем данные title блока в транзакции
            const titleData = await TitleData.create({
                blockId: block.id,
                text,
                textAlign: textAlign || 'left',
                fontWeight: fontWeight || '400',
                fontSize: fontSize || 'medium',
                color: color || '#000000',
                marginTop: marginTop || 0,
                marginBottom: marginBottom || 0
            }, { transaction });

            // Подтверждаем транзакцию
            await transaction.commit();

            // Возвращаем блок с данными
            const result = await Blocks.findByPk(block.id, {
                include: [{
                    model: TitleData,
                    as: 'titleData'
                }]
            });

            res.status(201).json(result);
        } catch (error) {
            // Откатываем транзакцию при ошибке
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    // Обновить title блок
    update: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { 
                order, 
                text, 
                textAlign, 
                fontWeight, 
                fontSize, 
                color, 
                marginTop, 
                marginBottom 
            } = req.body;

            // Проверяем существует ли блок
            const existingBlock = await Blocks.findOne({
                where: { id: req.params.id, type: 'title' }
            });

            if (!existingBlock) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Title block not found' });
            }

            // Обновляем основной блок в транзакции
            if (order !== undefined) {
                await Blocks.update(
                    { order },
                    { 
                        where: { id: req.params.id, type: 'title' },
                        transaction 
                    }
                );
            }

            // Обновляем данные title блока в транзакции
            const [updated] = await TitleData.update({
                text,
                textAlign,
                fontWeight,
                fontSize,
                color,
                marginTop,
                marginBottom
            }, {
                where: { blockId: req.params.id },
                transaction
            });

            if (!updated) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Title block data not found' });
            }

            // Подтверждаем транзакцию
            await transaction.commit();

            // Возвращаем обновленный блок
            const result = await Blocks.findByPk(req.params.id, {
                include: [{
                    model: TitleData,
                    as: 'titleData'
                }]
            });

            res.json(result);
        } catch (error) {
            // Откатываем транзакцию при ошибке
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить title блок
    delete: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            // Проверяем существует ли блок
            const existingBlock = await Blocks.findOne({
                where: { id: req.params.id, type: 'title' }
            });

            if (!existingBlock) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Title block not found' });
            }

            // Удаляем данные title блока в транзакции
            await TitleData.destroy({
                where: { blockId: req.params.id },
                transaction
            });

            // Удаляем основной блок в транзакции
            await Blocks.destroy({
                where: { id: req.params.id, type: 'title' },
                transaction
            });

            // Подтверждаем транзакцию
            await transaction.commit();

            res.json({ message: 'Title block deleted successfully' });
        } catch (error) {
            // Откатываем транзакцию при ошибке
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    // Получить title блок по ID
    getById: async (req, res) => {
        try {
            const block = await Blocks.findOne({
                where: { 
                    id: req.params.id,
                    type: 'title'
                },
                include: [{
                    model: TitleData,
                    as: 'titleData'
                }]
            });

            if (!block) {
                return res.status(404).json({ error: 'Title block not found' });
            }

            res.json(block);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить опции для фронтенда
    getOptions: async (req, res) => {
        try {
            const options = {
                textAlign: TitleData.rawAttributes.textAlign.values,
                fontWeight: TitleData.rawAttributes.fontWeight.values,
                fontSize: TitleData.rawAttributes.fontSize.values
            };
            res.json(options);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = titleBlockController;