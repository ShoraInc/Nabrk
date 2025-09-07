// src/pages/DirectorBlog/DirectorBlog.js

import React, { useState, useEffect } from 'react';
import './DirectorBlog.scss';
import avatarImage from './components/assets/avatar.jpg';
import { useTranslations } from '../../hooks/useTranslations';

const DirectorBlog = () => {
  const { t, currentLanguage } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });


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
          language: currentLanguage
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification(t('directorBlog.successMessage'), 'success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        showNotification(t('directorBlog.errorMessage'), 'error');
      }
    } catch (error) {
      showNotification(t('directorBlog.errorMessage'), 'error');
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

      {/* Main Content */}
      <main className="director-main">
        {/* Sidebar */}
        <aside className="director-sidebar">
          <div className="director-avatar-section">
            <div className="director-avatar">
              <img src={avatarImage} alt="Директор библиотеки" className="director-avatar-image" />
            </div>
            <h2 className="director-name-text">{t('directorBlog.name')}</h2>
            <p className="director-position-text">{t('directorBlog.position')}</p>
            
            <div className="director-social-links">
              <a href="https://www.facebook.com/share/15gtL7SYHV/" target="_blank" rel="noopener noreferrer" className="director-social-link">
                <img src="/assets/icons/FacebookIcon.png" alt="Facebook" className="director-social-icon" />
              </a>
              <a href="https://www.instagram.com/akademiyalik_kitapkhana?igsh=eHVldGYzM3BsZGMy" target="_blank" rel="noopener noreferrer" className="director-social-link">
                <img src="/assets/icons/InstagramIcon.png" alt="Instagram" className="director-social-icon" />
              </a>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="director-content">
          <h1 className="director-title">{t('directorBlog.title')}</h1>
          <div className="director-paragraphs">
            {t('directorBlog.paragraphs').map((paragraph, index) => (
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
            <h2 className="director-contact-title">{t('directorBlog.contactTitle')}</h2>
            
            <div className="director-form-group">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="director-form-input" 
                placeholder={t('directorBlog.namePlaceholder')}
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
                placeholder={t('directorBlog.emailPlaceholder')}
                required
              />
            </div>
            
            <div className="director-form-group">
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="director-form-textarea" 
                placeholder={t('directorBlog.messagePlaceholder')}
                required
              />
            </div>
            
            <button type="submit" className="director-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="director-loading">
                  <div className="director-spinner"></div>
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                t('directorBlog.submitBtn')
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default DirectorBlog;