const nodemailer = require('nodemailer');

// Настройки SMTP (можно использовать Gmail, Yandex, Mail.ru и т.д.)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true для 465, false для других портов
    auth: {
      user: process.env.SMTP_USER, // email отправителя
      pass: process.env.SMTP_PASS  // пароль приложения
    }
  });
};

// Шаблоны email для разных языков
const getEmailTemplates = (language) => {
  const templates = {
    kz: {
      subject: 'Ұлттық академиялық кітапхана - Директорға хабарлама',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d2ac2d;">Ұлттық академиялық кітапхана</h2>
          <h3 style="color: #333;">Директорға жаңа хабарлама</h3>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Хабарлама мәліметтері:</h4>
            <p><strong>Аты-жөні:</strong> ${data.name}</p>
            <p><strong>Электронды пошта:</strong> ${data.email}</p>
            <p><strong>Хабарлама:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #d2ac2d;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            Бұл хабарлама ${new Date().toLocaleString('kk-KZ')} күні сайт арқылы жіберілді.
          </p>
        </div>
      `
    },
    ru: {
      subject: 'Национальная академическая библиотека - Сообщение директору',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d2ac2d;">Национальная академическая библиотека</h2>
          <h3 style="color: #333;">Новое сообщение директору</h3>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Данные сообщения:</h4>
            <p><strong>Имя:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Сообщение:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #d2ac2d;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            Это сообщение было отправлено через сайт ${new Date().toLocaleString('ru-RU')}.
          </p>
        </div>
      `
    },
    en: {
      subject: 'National Academic Library - Message to Director',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d2ac2d;">National Academic Library</h2>
          <h3 style="color: #333;">New Message to Director</h3>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Message Details:</h4>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #d2ac2d;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px;">
            This message was sent through the website on ${new Date().toLocaleString('en-US')}.
          </p>
        </div>
      `
    }
  };

  return templates[language] || templates.ru; // fallback на русский
};

// Основная функция отправки email
const sendDirectorEmail = async (data) => {
  try {
    const { name, email, message, language = 'ru' } = data;

    // Валидация данных
    if (!name || !email || !message) {
      throw new Error('Все поля обязательны для заполнения');
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Некорректный email адрес');
    }

    const transporter = createTransporter();
    const template = getEmailTemplates(language);

    // Настройки письма
    const mailOptions = {
      from: process.env.SMTP_USER, // отправитель
      to: process.env.DIRECTOR_EMAIL || 'director@nabrk.kz', // получатель (директор)
      replyTo: email, // для ответа на email отправителя
      subject: template.subject,
      html: template.html({ name, email, message })
    };

    // Отправка письма
    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', result.messageId);
    return {
      success: true,
      messageId: result.messageId,
      message: 'Сообщение успешно отправлено'
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Ошибка при отправке сообщения'
    };
  }
};

// Функция для тестирования подключения
const testConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return { success: true, message: 'SMTP подключение успешно' };
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendDirectorEmail,
  testConnection
};
