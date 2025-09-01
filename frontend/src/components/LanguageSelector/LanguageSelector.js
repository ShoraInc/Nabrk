// components/LanguageSelector/LanguageSelector.js
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSelector.scss';

const LanguageSelector = ({ variant = 'default' }) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const getCurrentLanguageName = () => {
    return languages[currentLanguage]?.name || currentLanguage.toUpperCase();
  };

  const getLanguageFlag = (langCode) => {
    const flags = {
      'kz': '🇰🇿',
      'ru': '🇷🇺',
      'en': '🇺🇸'
    };
    return flags[langCode] || '🌐';
  };

  return (
    <div 
      className={`language-selector ${variant}`} 
      ref={dropdownRef}
    >
      <button
        className={`language-selector__trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="language-selector__flag">
          {getLanguageFlag(currentLanguage)}
        </span>
        <span className="language-selector__text">
          {getCurrentLanguageName()}
        </span>
        <svg 
          className={`language-selector__arrow ${isOpen ? 'rotated' : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8"
        >
          <path 
            d="M1 1L6 6L11 1" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="language-selector__dropdown">
          <div className="language-selector__dropdown-inner">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                className={`language-selector__option ${
                  code === currentLanguage ? 'active' : ''
                }`}
                onClick={() => handleLanguageSelect(code)}
              >
                <span className="language-selector__option-flag">
                  {getLanguageFlag(code)}
                </span>
                <span className="language-selector__option-text">
                  {lang.name}
                </span>
                {code === currentLanguage && (
                  <svg 
                    className="language-selector__check"
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16"
                  >
                    <path 
                      d="M13.5 4.5L6 12L2.5 8.5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;