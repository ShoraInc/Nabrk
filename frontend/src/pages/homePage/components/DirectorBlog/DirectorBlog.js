// src/pages/DirectorBlog/DirectorBlog.js

import React, { useState, useEffect } from 'react';
import './DirectorBlog.scss';

const DirectorBlog = () => {
  const [language, setLanguage] = useState('rus');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const content = {
    'kaz': {
      title: 'Құрметті оқырмандар!',
      paragraphs: [
        'Сіздердің ойларыңызды, идеяларыңызды, ұсыныстарыңызды және сұрақтарыңызды есту – мен үшін өте маңызды. Әрбір жолданған пікір мен үшін құнды, себебі дәл сіздердің қолдауларыңыз бізді дамуға, жақсара түсуге шабыттандырады.',
        'Енді менімен тікелей байланысып, сізді толғандыратын мәселелермен бөлісуге мүмкіндік бар. Жазған барлық хабарламаларыңызды өзім оқып, қолымнан келгенше жауап беруге тырысамын.',
        'Ашық әрі сенімді диалог кітапханамызды әрқайсыңызға жақындай түседі деп сенемін.',
        'Ізгі ниетпен,',
        'Сеитова Күміс Қарсақбайқызы',
        'Қазақстан Республикасының Ұлттық академиялық кітапханасының директоры'
      ],
      name: 'Сеитова Күміс Қарсақбайқызы',
      position: 'Қазақстан Республикасының Ұлттық академиялық кітапханасының директоры',
      headerText: 'Қазақстан Республикасының Ұлттық академиялық кітапханасы',
      contactTitle: 'Маған хабарласу',
      namePlaceholder: 'Аты-жөніңіз',
      emailPlaceholder: 'Сіздің поштаңыз',
      messagePlaceholder: 'Хабарламаңыз',
      submitBtn: 'Жіберу',
      successMessage: 'Хабарлама сәтті жіберілді!',
      errorMessage: 'Хабарламаны жіберу кезінде қате пайда болды'
    },
    'rus': {
      title: 'Дорогие читатели!',
      paragraphs: [
        'Мне важно слышать ваш голос — ваши мысли, идеи, предложения и вопросы. Каждое обращение для меня ценно, ведь именно вы вдохновляете нас развиваться и становиться лучше.',
        'Теперь у вас есть возможность напрямую делиться со мной тем, что волнует вас как читателя. Я буду лично читать все ваши сообщения и стараться отвечать на них.',
        'Верю, что открытый и доверительный диалог сделает нашу библиотеку ещё ближе к каждому из вас.',
        'С уважением,',
        'Сеитова Күмис Карсакбаевна',
        'Директор Национальной академической библиотеки Республики Казахстан'
      ],
      name: 'Сеитова Күмис Карсакбаевна',
      position: 'Директор Национальной академической библиотеки Республики Казахстан',
      headerText: 'Национальная академическая библиотека Республики Казахстан',
      contactTitle: 'Связаться со мной',
      namePlaceholder: 'Ваше имя',
      emailPlaceholder: 'Ваша почта',
      messagePlaceholder: 'Ваше сообщение',
      submitBtn: 'Отправить',
      successMessage: 'Сообщение успешно отправлено!',
      errorMessage: 'Ошибка при отправке сообщения'
    },
    'eng': {
      title: 'Dear readers,',
      paragraphs: [
        'It is important for me to hear your voice — your thoughts, ideas, suggestions, and questions. Every message is valuable to me, as it is your support that inspires us to grow and improve.',
        'You now have the opportunity to contact me directly and share anything that concerns you as a reader. I will personally read all your messages and do my best to respond.',
        'I believe that open and trustful dialogue will make our library even closer to each of you.',
        'With respect,',
        'Kumis Karsakbaevna Seitova',
        'Director of the National Academic Library of the Republic of Kazakhstan'
      ],
      name: 'Kumis Karsakbaevna Seitova',
      position: 'Director of the National Academic Library of the Republic of Kazakhstan',
      headerText: 'National Academic Library of the Republic of Kazakhstan',
      contactTitle: 'Contact Me',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Your Email',
      messagePlaceholder: 'Your Message',
      submitBtn: 'Send',
      successMessage: 'Message sent successfully!',
      errorMessage: 'Error sending message'
    }
  };

  const currentContent = content[language];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-director-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          language
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification(currentContent.successMessage, 'success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        showNotification(currentContent.errorMessage, 'error');
      }
    } catch (error) {
      showNotification(currentContent.errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="director-blog-container">
      {/* Notification */}
      {notification && (
        <div className={`director-notification director-notification-${notification.type} ${notification ? 'show' : ''}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="director-header">
        <div className="director-header-content">
          {/* Language Selector */}
          <div className="director-language-selector">
            {Object.keys(content).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`director-lang-btn ${language === lang ? 'active' : ''}`}
              >
                {lang === 'rus' ? 'Русский' : lang === 'kaz' ? 'Қазақша' : 'English'}
              </button>
            ))}
          </div>
          
          {/* Logo Section */}
          <div className="director-logo-section">
            <div className="director-logo">
              <div className="director-logo-placeholder"></div>
            </div>
            <a href="https://nabrk.kz" target="_blank" rel="noopener noreferrer" className="director-header-title">
              {currentContent.headerText}
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="director-main">
        {/* Sidebar */}
        <aside className="director-sidebar">
          <div className="director-avatar-section">
            <div className="director-avatar">
              <div className="director-avatar-placeholder"></div>
            </div>
            <h2 className="director-name-text">{currentContent.name}</h2>
            <p className="director-position-text">{currentContent.position}</p>
            
            <div className="director-social-links">
              <a href="https://www.facebook.com/share/15gtL7SYHV/" target="_blank" rel="noopener noreferrer" className="director-social-link">
                📘
              </a>
              <a href="https://www.instagram.com/akademiyalik_kitapkhana?igsh=eHVldGYzM3BsZGMy" target="_blank" rel="noopener noreferrer" className="director-social-link">
                📷
              </a>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="director-content">
          <h1 className="director-title">{currentContent.title}</h1>
          <div className="director-paragraphs">
            {currentContent.paragraphs.map((paragraph, index) => (
              <p key={index} className="director-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>

      {/* Contact Form */}
      <section className="director-contact-section">
        <div className="director-contact-container">
          <form className="director-contact-form" onSubmit={handleSubmit}>
            <h2 className="director-contact-title">{currentContent.contactTitle}</h2>
            
            <div className="director-form-group">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="director-form-input" 
                placeholder={currentContent.namePlaceholder}
                required
              />
            </div>
            
            <div className="director-form-group">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="director-form-input" 
                placeholder={currentContent.emailPlaceholder}
                required
              />
            </div>
            
            <div className="director-form-group">
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="director-form-textarea" 
                placeholder={currentContent.messagePlaceholder}
                required
              />
            </div>
            
            <button type="submit" className="director-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="director-loading">
                  <div className="director-spinner"></div>
                  <span>{language === 'rus' ? 'Отправка...' : language === 'kaz' ? 'Жіберіліп жатыр...' : 'Sending...'}</span>
                </div>
              ) : (
                currentContent.submitBtn
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default DirectorBlog;