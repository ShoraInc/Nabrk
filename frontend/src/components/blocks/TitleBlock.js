// components/blocks/TitleBlock.js

import React from 'react';

const TitleBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const { data } = block;
  const { translations = {} } = data;

  // Получаем список реально существующих переводов
  const availableLangs = Object.keys(translations).filter(lang => translations[lang]);

  // Получаем текст для текущего языка с фоллбэком
  const getText = () => {
    return translations[currentLanguage] ||
           translations['kz'] ||
           translations['ru'] ||
           translations['en'] ||
           Object.values(translations).find(Boolean) ||
           '';
  };

  const text = getText();

  if (!text) {
    return null;
  }

  // Мобильные стили - только безопасные свойства
  const mobileStyles = {
    fontSize: '18px',
    fontWeight: '500',
    color: data.color || '#333333',
    textAlign: data.textAlign || 'left',
    lineHeight: '1.4',
    margin: '12px 0',
    padding: 0,
    wordWrap: 'break-word',
    hyphens: 'auto',
    fontFamily: "'Cormorant SC', 'Times New Roman', 'serif'"
  };

  // Десктопные стили - все из БД
  const desktopStyles = {
    fontSize: data.fontSize || '24px',
    fontWeight: data.fontWeight || '600',
    color: data.color || '#333333',
    textAlign: data.textAlign || 'left',
    marginTop: `${data.marginTop || 0}px`,
    marginBottom: `${data.marginBottom || 16}px`,
    lineHeight: '1.3',
    padding: 0,
    letterSpacing: '-0.01em',
    wordWrap: 'break-word',
    fontFamily: "'Cormorant SC', 'Times New Roman', 'serif'"
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <h1 style={styles} className="title-block">
      {text}
    </h1>
  );
};

export default TitleBlock;