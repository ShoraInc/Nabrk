const News = require("../models/News");
const Events = require("../models/Events");
const Texts = require("../models/Texts");
const TextTranslations = require("../models/TextTranslations");
const { Op } = require("sequelize");

// Get missing translations for all content
const getMissingTranslations = async (req, res) => {
    try {
        const { lang } = req.query;
        const missingTranslations = [];

        if (lang) {
            // Check for specific language
            const newsWithMissingTranslations = await News.findAll({
                include: [
                    {
                        model: Texts,
                        as: 'titleText',
                        include: [{
                            model: TextTranslations,
                            as: 'translations',
                            where: { languageCode: lang },
                            required: false
                        }]
                    }
                ]
            });

            // Add logic to find missing translations
            // This is a simplified version - you might want to expand this
            
        } else {
            // Get all languages that exist
            const existingLanguages = await TextTranslations.findAll({
                attributes: ['languageCode'],
                group: ['languageCode']
            });

            const languages = existingLanguages.map(l => l.languageCode);

            // Check each content type for missing languages
            const allNews = await News.findAll();
            const allEvents = await Events.findAll();

            for (const news of allNews) {
                for (const language of languages) {
                    const titleTranslation = await TextTranslations.findOne({
                        where: { textId: news.titleTextId, languageCode: language }
                    });

                    if (!titleTranslation) {
                        missingTranslations.push({
                            type: 'news',
                            id: news.id,
                            field: 'title',
                            missingLanguage: language,
                            textId: news.titleTextId
                        });
                    }
                }
            }

            for (const event of allEvents) {
                for (const language of languages) {
                    const nameTranslation = await TextTranslations.findOne({
                        where: { textId: event.nameTextId, languageCode: language }
                    });

                    if (!nameTranslation) {
                        missingTranslations.push({
                            type: 'event',
                            id: event.id,
                            field: 'name',
                            missingLanguage: language,
                            textId: event.nameTextId
                        });
                    }
                }
            }
        }

        res.json({
            missingTranslations,
            total: missingTranslations.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get translation statistics
const getTranslationStats = async (req, res) => {
    try {
        // Get all languages
        const languages = await TextTranslations.findAll({
            attributes: ['languageCode'],
            group: ['languageCode']
        });

        const stats = {};

        for (const lang of languages) {
            const languageCode = lang.languageCode;
            
            // Count translations for this language
            const translationCount = await TextTranslations.count({
                where: { languageCode }
            });

            // Count total texts
            const totalTexts = await Texts.count();

            stats[languageCode] = {
                translatedTexts: translationCount,
                totalTexts: totalTexts,
                completionPercentage: totalTexts > 0 ? Math.round((translationCount / totalTexts) * 100) : 0
            };
        }

        res.json({ stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Bulk add translations
const bulkAddTranslations = async (req, res) => {
    try {
        const { translations } = req.body;
        // translations should be an array of { textId, languageCode, textValue }

        const results = [];

        for (const translation of translations) {
            try {
                const created = await TextTranslations.create({
                    textId: translation.textId,
                    languageCode: translation.languageCode,
                    textValue: translation.textValue
                });
                results.push({ success: true, id: created.id });
            } catch (error) {
                results.push({ success: false, error: error.message });
            }
        }

        res.json({
            message: 'Bulk translation completed',
            results,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMissingTranslations,
    getTranslationStats,
    bulkAddTranslations
};