// components/LanguageSelector.js
import React, { useState } from 'react';
import './LanguageSelector.scss';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = ({ isMobile = false }) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const getButtonClasses = () => {
    let classes = 'language-selector__button';
    if (isOpen) classes += ' language-selector__button--active';
    if (isMobile) classes += ' language-selector__button--mobile';
    return classes;
  };

  const getItemClasses = (code) => {
    let classes = 'language-selector__item';
    if (code === currentLanguage) classes += ' language-selector__item--active';
    if (isMobile) classes += ' language-selector__item--mobile';
    return classes;
  };

  const getArrowClasses = () => {
    let classes = 'language-selector__arrow';
    if (isOpen) classes += ' language-selector__arrow--rotated';
    return classes;
  };

  return (
    <div className="language-selector">
      <button
        className={getButtonClasses()}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <span>{languages[currentLanguage]?.name || currentLanguage}</span>
        <span className={getArrowClasses()}>▼</span>
      </button>

      {isOpen && (
        <div className="language-selector__dropdown">
          {Object.entries(languages).map(([code, language]) => (
            <button
              key={code}
              className={getItemClasses(code)}
              onClick={() => handleLanguageChange(code)}
            >
              <span>{language.name}</span>
              {code === currentLanguage && (
                <span className="language-selector__check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;