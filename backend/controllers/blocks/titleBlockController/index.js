const { Blocks, TitleData, Texts, TextTranslations, sequelize } = require('../../../models');

const titleBlockController = {
    // Создать title блок с переводом
    create: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { 
                pageId, 
                order, 
                text, 
                language = 'kz', // По умолчанию казахский
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

            // Создаем запись в таблице Texts
            const textRecord = await Texts.create({}, { transaction });

            // Создаем перевод для указанного языка
            await TextTranslations.create({
                textId: textRecord.id,
                languageCode: language,
                textValue: text
            }, { transaction });

            // Создаем основной блок
            const block = await Blocks.create({
                pageId,
                type: 'title',
                order: order || 0
            }, { transaction });

            // Создаем данные title блока
            const titleData = await TitleData.create({
                blockId: block.id,
                textId: textRecord.id,
                textAlign: textAlign || 'left',
                fontWeight: fontWeight || '400',
                fontSize: fontSize || '16px',
                color: color || '#000000',
                marginTop: marginTop || 0,
                marginBottom: marginBottom || 0
            }, { transaction });

            await transaction.commit();

            // Возвращаем блок с данными и переводами
            const result = await Blocks.findByPk(block.id, {
                include: [{
                    model: TitleData,
                    as: 'titleData',
                    include: [{
                        model: Texts,
                        as: 'text',
                        include: [{
                            model: TextTranslations,
                            as: 'translations'
                        }]
                    }]
                }]
            });

            res.status(201).json(result);
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    // Обновить title блок (без изменения текста)
    update: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { 
                order, 
                textAlign, 
                fontWeight, 
                fontSize, 
                color, 
                marginTop, 
                marginBottom 
            } = req.body;

            const existingBlock = await Blocks.findOne({
                where: { id: req.params.id, type: 'title' }
            });

            if (!existingBlock) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Title block not found' });
            }

            // Обновляем основной блок
            if (order !== undefined) {
                await Blocks.update(
                    { order },
                    { 
                        where: { id: req.params.id, type: 'title' },
                        transaction 
                    }
                );
            }

            // Обновляем данные title блока
            const updateData = {};
            if (textAlign !== undefined) updateData.textAlign = textAlign;
            if (fontWeight !== undefined) updateData.fontWeight = fontWeight;
            if (fontSize !== undefined) updateData.fontSize = fontSize;
            if (color !== undefined) updateData.color = color;
            if (marginTop !== undefined) updateData.marginTop = marginTop;
            if (marginBottom !== undefined) updateData.marginBottom = marginBottom;

            const [updated] = await TitleData.update(updateData, {
                where: { blockId: req.params.id },
                transaction
            });

            if (!updated) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Title block data not found' });
            }

            await transaction.commit();

            // Возвращаем обновленный блок
            const result = await Blocks.findByPk(req.params.id, {
                include: [{
                    model: TitleData,
                    as: 'titleData',
                    include: [{
                        model: Texts,
                        as: 'text',
                        include: [{
                            model: TextTranslations,
                            as: 'translations'
                        }]
                    }]
                }]
            });

            res.json(result);
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить title блок
    delete: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const existingBlock = await Blocks.findOne({
                where: { id: req.params.id, type: 'title' },
                include: [{
                    model: TitleData,
                    as: 'titleData'
                }]
            });

            if (!existingBlock) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Title block not found' });
            }

            const textId = existingBlock.titleData.textId;

            // Удаляем все переводы
            await TextTranslations.destroy({
                where: { textId },
                transaction
            });

            // Удаляем запись из Texts
            await Texts.destroy({
                where: { id: textId },
                transaction
            });

            // Удаляем данные title блока
            await TitleData.destroy({
                where: { blockId: req.params.id },
                transaction
            });

            // Удаляем основной блок
            await Blocks.destroy({
                where: { id: req.params.id, type: 'title' },
                transaction
            });

            await transaction.commit();

            res.json({ message: 'Title block deleted successfully' });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: error.message });
        }
    },

    // Получить title блок по ID с переводами
    getById: async (req, res) => {
        try {
            const { lang = 'kz' } = req.query;

            const block = await Blocks.findOne({
                where: { 
                    id: req.params.id,
                    type: 'title'
                },
                include: [{
                    model: TitleData,
                    as: 'titleData',
                    include: [{
                        model: Texts,
                        as: 'text',
                        include: [{
                            model: TextTranslations,
                            as: 'translations',
                            where: { languageCode: lang },
                            required: false
                        }]
                    }]
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

    // Получить все переводы для title блока
    getTranslations: async (req, res) => {
        try {
            const block = await Blocks.findOne({
                where: { 
                    id: req.params.id,
                    type: 'title'
                },
                include: [{
                    model: TitleData,
                    as: 'titleData',
                    include: [{
                        model: Texts,
                        as: 'text',
                        include: [{
                            model: TextTranslations,
                            as: 'translations'
                        }]
                    }]
                }]
            });

            if (!block) {
                return res.status(404).json({ error: 'Title block not found' });
            }

            res.json(block.titleData.text.translations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Добавить перевод для title блока
    addTranslation: async (req, res) => {
        try {
            const { text } = req.body;
            const { lang } = req.params;

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

            const textId = block.titleData.textId;

            // Проверяем, есть ли уже перевод для этого языка
            const existingTranslation = await TextTranslations.findOne({
                where: { textId, languageCode: lang }
            });

            if (existingTranslation) {
                return res.status(400).json({ 
                    error: `Translation for language '${lang}' already exists` 
                });
            }

            const translation = await TextTranslations.create({
                textId,
                languageCode: lang,
                textValue: text
            });

            res.status(201).json(translation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Обновить перевод для title блока
    updateTranslation: async (req, res) => {
        try {
            const { text } = req.body;
            const { lang } = req.params;

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

            const textId = block.titleData.textId;

            const [updated] = await TextTranslations.update(
                { textValue: text },
                { where: { textId, languageCode: lang } }
            );

            if (!updated) {
                return res.status(404).json({ 
                    error: `Translation for language '${lang}' not found` 
                });
            }

            const translation = await TextTranslations.findOne({
                where: { textId, languageCode: lang }
            });

            res.json(translation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Удалить перевод для title блока
    deleteTranslation: async (req, res) => {
        try {
            const { lang } = req.params;

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

            const textId = block.titleData.textId;

            const deleted = await TextTranslations.destroy({
                where: { textId, languageCode: lang }
            });

            if (!deleted) {
                return res.status(404).json({ 
                    error: `Translation for language '${lang}' not found` 
                });
            }

            res.json({ message: `Translation for language '${lang}' deleted successfully` });
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
                fontSize: TitleData.rawAttributes.fontSize.values,
                languages: ['en', 'ru', 'kz']
            };
            res.json(options);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = titleBlockController;