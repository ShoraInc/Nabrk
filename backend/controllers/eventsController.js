const Events = require("../models/Events");
const Texts = require("../models/Texts");
const TextTranslations = require("../models/TextTranslations");
const { Op } = require("sequelize");

// Get all events with translations
const getAllEvents = async (req, res) => {
    try {
        const { lang = 'kz', upcoming = false, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = { isActive: true };
        
        if (upcoming === 'true') {
            whereClause.eventDate = {
                [Op.gte]: new Date()
            };
        }

        const events = await Events.findAndCountAll({
            where: whereClause,
            order: [['eventDate', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const eventsWithTranslations = await Promise.all(
            events.rows.map(async (item) => {
                const [name, description, place] = await Promise.all([
                    TextTranslations.findOne({
                        where: { textId: item.nameTextId, languageCode: lang }
                    }),
                    TextTranslations.findOne({
                        where: { textId: item.descriptionTextId, languageCode: lang }
                    }),
                    TextTranslations.findOne({
                        where: { textId: item.placeTextId, languageCode: lang }
                    })
                ]);

                return {
                    id: item.id,
                    name: name?.textValue || 'No translation',
                    description: description?.textValue || 'No translation',
                    place: place?.textValue || 'No translation',
                    eventDate: item.eventDate,
                    eventTime: item.eventTime,
                    imageUrl: item.imageUrl,
                    isUpcoming: new Date(item.eventDate) >= new Date()
                };
            })
        );

        res.json({
            events: eventsWithTranslations,
            totalPages: Math.ceil(events.count / limit),
            currentPage: parseInt(page),
            totalItems: events.count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single event by ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const { lang = 'kz' } = req.query;

        const event = await Events.findOne({
            where: { id, isActive: true }
        });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const [name, description, place] = await Promise.all([
            TextTranslations.findOne({
                where: { textId: event.nameTextId, languageCode: lang }
            }),
            TextTranslations.findOne({
                where: { textId: event.descriptionTextId, languageCode: lang }
            }),
            TextTranslations.findOne({
                where: { textId: event.placeTextId, languageCode: lang }
            })
        ]);

        res.json({
            id: event.id,
            name: name?.textValue || 'No translation',
            description: description?.textValue || 'No translation',
            place: place?.textValue || 'No translation',
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            imageUrl: event.imageUrl,
            isUpcoming: new Date(event.eventDate) >= new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get upcoming events (next 5)
const getUpcomingEvents = async (req, res) => {
    try {
        const { lang = 'kz' } = req.query;

        const events = await Events.findAll({
            where: {
                isActive: true,
                eventDate: {
                    [Op.gte]: new Date()
                }
            },
            order: [['eventDate', 'ASC']],
            limit: 5
        });

        const eventsWithTranslations = await Promise.all(
            events.map(async (item) => {
                const [name, place] = await Promise.all([
                    TextTranslations.findOne({
                        where: { textId: item.nameTextId, languageCode: lang }
                    }),
                    TextTranslations.findOne({
                        where: { textId: item.placeTextId, languageCode: lang }
                    })
                ]);

                return {
                    id: item.id,
                    name: name?.textValue || 'No translation',
                    place: place?.textValue || 'No translation',
                    eventDate: item.eventDate,
                    eventTime: item.eventTime,
                    imageUrl: item.imageUrl
                };
            })
        );

        res.json(eventsWithTranslations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create event draft
const createEventDraft = async (req, res) => {
    try {
        const { name, description, place, eventDate, eventTime, language = 'kz' } = req.body;

        if (!name || !description || !place || !eventDate) {
            return res.status(400).json({ 
                error: 'Name, description, place and eventDate are required' 
            });
        }

        // Create Texts entries
        const nameText = await Texts.create({});
        const descriptionText = await Texts.create({});
        const placeText = await Texts.create({});

        // Create TextTranslations
        await TextTranslations.create({
            textId: nameText.id,
            languageCode: language,
            textValue: name
        });

        await TextTranslations.create({
            textId: descriptionText.id,
            languageCode: language,
            textValue: description
        });

        await TextTranslations.create({
            textId: placeText.id,
            languageCode: language,
            textValue: place
        });

        // Create Event entry
        const event = await Events.create({
            nameTextId: nameText.id,
            descriptionTextId: descriptionText.id,
            placeTextId: placeText.id,
            eventDate,
            eventTime: eventTime || null,
            imageUrl: null, // No images for events
            isActive: false
        });

        res.status(201).json({
            id: event.id,
            message: 'Event draft created successfully',
            primaryLanguage: language
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all translations for event
const getEventTranslations = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Events.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const nameTranslations = await TextTranslations.findAll({
            where: { textId: event.nameTextId }
        });

        const descriptionTranslations = await TextTranslations.findAll({
            where: { textId: event.descriptionTextId }
        });

        const placeTranslations = await TextTranslations.findAll({
            where: { textId: event.placeTextId }
        });

        const translations = {};
        
        nameTranslations.forEach(t => {
            if (!translations[t.languageCode]) translations[t.languageCode] = {};
            translations[t.languageCode].name = t.textValue;
        });

        descriptionTranslations.forEach(t => {
            if (!translations[t.languageCode]) translations[t.languageCode] = {};
            translations[t.languageCode].description = t.textValue;
        });

        placeTranslations.forEach(t => {
            if (!translations[t.languageCode]) translations[t.languageCode] = {};
            translations[t.languageCode].place = t.textValue;
        });

        res.json({
            eventId: event.id,
            translations,
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            imageUrl: event.imageUrl,
            isActive: event.isActive
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add translation for specific language
const addEventTranslation = async (req, res) => {
    try {
        const { id, lang } = req.params;
        const { name, description, place } = req.body;

        const event = await Events.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if translation already exists
        const existingName = await TextTranslations.findOne({
            where: { textId: event.nameTextId, languageCode: lang }
        });

        if (existingName) {
            return res.status(400).json({ error: "Translation for this language already exists. Use PUT to update." });
        }

        // Add translations
        await TextTranslations.create({
            textId: event.nameTextId,
            languageCode: lang,
            textValue: name
        });

        await TextTranslations.create({
            textId: event.descriptionTextId,
            languageCode: lang,
            textValue: description
        });

        await TextTranslations.create({
            textId: event.placeTextId,
            languageCode: lang,
            textValue: place
        });

        res.json({ message: `Translation added for ${lang}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update translation for specific language
const updateEventTranslation = async (req, res) => {
    try {
        const { id, lang } = req.params;
        const { name, description, place } = req.body;

        const event = await Events.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Update translations
        if (name) {
            await TextTranslations.update(
                { textValue: name },
                { where: { textId: event.nameTextId, languageCode: lang } }
            );
        }

        if (description) {
            await TextTranslations.update(
                { textValue: description },
                { where: { textId: event.descriptionTextId, languageCode: lang } }
            );
        }

        if (place) {
            await TextTranslations.update(
                { textValue: place },
                { where: { textId: event.placeTextId, languageCode: lang } }
            );
        }

        res.json({ message: `Translation updated for ${lang}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete translation for specific language
const deleteEventTranslation = async (req, res) => {
    try {
        const { id, lang } = req.params;

        const event = await Events.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Delete translations
        await TextTranslations.destroy({
            where: { textId: event.nameTextId, languageCode: lang }
        });

        await TextTranslations.destroy({
            where: { textId: event.descriptionTextId, languageCode: lang }
        });

        await TextTranslations.destroy({
            where: { textId: event.placeTextId, languageCode: lang }
        });

        res.json({ message: `Translation deleted for ${lang}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Activate event
const activateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        await Events.update(
            { isActive: true },
            { where: { id } }
        );

        res.json({ message: "Event activated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deactivate event
const deactivateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        await Events.update(
            { isActive: false },
            { where: { id } }
        );

        res.json({ message: "Event deactivated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all drafts
const getEventDrafts = async (req, res) => {
    try {
        const { lang = 'kz', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const events = await Events.findAndCountAll({
            where: { isActive: false },
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const eventsWithTranslations = await Promise.all(
            events.rows.map(async (item) => {
                const name = await TextTranslations.findOne({
                    where: { textId: item.nameTextId, languageCode: lang }
                });

                return {
                    id: item.id,
                    name: name?.textValue || 'No translation',
                    eventDate: item.eventDate,
                    eventTime: item.eventTime,
                    imageUrl: item.imageUrl,
                    createdAt: item.createdAt
                };
            })
        );

        res.json({
            drafts: eventsWithTranslations,
            totalPages: Math.ceil(events.count / limit),
            currentPage: parseInt(page),
            totalItems: events.count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const event = await Events.findByPk(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Store textIds for later deletion
        const textIdsToDelete = [event.nameTextId, event.descriptionTextId, event.placeTextId];

        // 1. First delete Event record (this removes foreign key constraints)
        await Events.destroy({ where: { id } });

        // 2. Then delete related TextTranslations
        await TextTranslations.destroy({ 
            where: { 
                textId: {
                    [Op.in]: textIdsToDelete
                }
            } 
        });

        // 3. Finally delete Texts records
        await Texts.destroy({ 
            where: { 
                id: {
                    [Op.in]: textIdsToDelete
                }
            } 
        });
        
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    getUpcomingEvents,
    createEventDraft,
    getEventTranslations,
    addEventTranslation,
    updateEventTranslation,
    deleteEventTranslation,
    activateEvent,
    deactivateEvent,
    getEventDrafts,
    deleteEvent
};