// context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = {
  en: { code: 'en', name: 'English' },
  ru: { code: 'ru', name: 'Русский' },
  kz: { code: 'kz', name: 'Қазақша' }
};

export const DEFAULT_LANGUAGE = 'kz';

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Проверяем localStorage при инициализации
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedLanguage') || DEFAULT_LANGUAGE;
    }
    return DEFAULT_LANGUAGE;
  });

  // Сохраняем в localStorage при изменении языка
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', currentLanguage);
    }
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode);
    } else {
      console.warn(`Language ${languageCode} not supported`);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    languages: LANGUAGES,
    defaultLanguage: DEFAULT_LANGUAGE
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования языкового контекста
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;