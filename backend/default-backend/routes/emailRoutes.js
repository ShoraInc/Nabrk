const express = require('express');
const router = express.Router();
const { sendDirectorMessage, testSMTPConnection } = require('../controllers/emailController');

// Middleware для валидации JSON
router.use(express.json({ limit: '10mb' }));

// POST /api/send-director-email - Отправка сообщения директору
router.post('/send-director-email', sendDirectorMessage);

// GET /api/test-smtp - Тестирование SMTP подключения (для админов)
router.get('/test-smtp', testSMTPConnection);

module.exports = router;
