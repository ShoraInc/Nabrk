const { sendDirectorEmail, testConnection } = require('../services/emailService');

// Отправка сообщения директору
const sendDirectorMessage = async (req, res) => {
  try {
    const { name, email, message, language } = req.body;

    // Валидация обязательных полей
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Все поля обязательны для заполнения'
      });
    }

    // Валидация длины полей
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Имя должно содержать от 2 до 100 символов'
      });
    }

    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Сообщение должно содержать от 10 до 2000 символов'
      });
    }

    // Валидация языка
    const validLanguages = ['kz', 'ru', 'en'];
    const selectedLanguage = validLanguages.includes(language) ? language : 'ru';

    // Подготовка данных для отправки
    const emailData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      language: selectedLanguage
    };

    // Отправка email
    const result = await sendDirectorEmail(emailData);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Сообщение успешно отправлено директору',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Ошибка при отправке сообщения'
      });
    }

  } catch (error) {
    console.error('Error in sendDirectorMessage:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};

// Тестирование SMTP подключения
const testSMTPConnection = async (req, res) => {
  try {
    const result = await testConnection();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in testSMTPConnection:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при тестировании SMTP подключения'
    });
  }
};

module.exports = {
  sendDirectorMessage,
  testSMTPConnection
};
