const express = require("express");
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    getUpcomingEvents,
    createEventDraft,
    updateEvent,
    getEventTranslations,
    addEventTranslation,
    updateEventTranslation,
    deleteEventTranslation,
    activateEvent,
    deactivateEvent,
    getEventDrafts,
    deleteEvent
} = require("../controllers/eventsController");

/**
 * @route GET /api/events
 * @desc Get all active events
 * @query {string} [lang=ru] - Language code
 * @query {boolean} [upcoming=false] - Filter upcoming events
 * @query {number} [page=1] - Page number
 * @query {number} [limit=10] - Items per page
 */
router.get("/", getAllEvents);

/**
 * @route GET /api/events/drafts
 * @desc Get all event drafts
 * @query {string} [lang=ru] - Language code
 */
router.get("/drafts", getEventDrafts);

/**
 * @route GET /api/events/upcoming
 * @desc Get upcoming events (next 5)
 * @query {string} [lang=ru] - Language code
 */
router.get("/upcoming", getUpcomingEvents);

/**
 * @route GET /api/events/:id
 * @desc Get single event by ID
 * @query {string} [lang=ru] - Language code
 */
router.get("/:id", getEventById);

/**
 * @route GET /api/events/:id/translations
 * @desc Get all translations for event
 */
router.get("/:id/translations", getEventTranslations);

/**
 * @route POST /api/events/draft
 * @desc Create event draft
 * @body {string} name - Event name
 * @body {string} description - Event description
 * @body {string} place - Event place
 * @body {string} eventDate - Event date (YYYY-MM-DD)
 * @body {string} [eventTime] - Event time (HH:MM:SS)
 * @body {string} [language=ru] - Primary language
 */
router.post("/draft", createEventDraft);

/**
 * @route PUT /api/events/:id
 * @desc Update event (including date and time)
 * @body {string} [eventDate] - New event date (YYYY-MM-DD)
 * @body {string} [eventTime] - New event time (HH:MM:SS)
 */
router.put("/:id", updateEvent);

/**
 * @route POST /api/events/:id/translations/:lang
 * @desc Add translation for specific language
 * @body {string} name - Translated name
 * @body {string} description - Translated description
 * @body {string} place - Translated place
 */
router.post("/:id/translations/:lang", addEventTranslation);

/**
 * @route PUT /api/events/:id/translations/:lang
 * @desc Update translation for specific language
 * @body {string} [name] - Updated name
 * @body {string} [description] - Updated description
 * @body {string} [place] - Updated place
 */
router.put("/:id/translations/:lang", updateEventTranslation);

/**
 * @route PUT /api/events/:id/activate
 * @desc Activate event
 */
router.put("/:id/activate", activateEvent);

/**
 * @route PUT /api/events/:id/deactivate
 * @desc Deactivate event
 */
router.put("/:id/deactivate", deactivateEvent);

/**
 * @route DELETE /api/events/:id/translations/:lang
 * @desc Delete translation for specific language
 */
router.delete("/:id/translations/:lang", deleteEventTranslation);

/**
 * @route DELETE /api/events/:id
 * @desc Delete event completely
 */
router.delete("/:id", deleteEvent);

module.exports = router;