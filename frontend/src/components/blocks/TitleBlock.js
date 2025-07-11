// components/blocks/TitleBlock.js

import React from 'react';

const TitleBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const { data } = block;
  const { translations = {} } = data;

  // Получаем текст для текущего языка с фоллбэком
  const getText = () => {
    return translations[currentLanguage] || 
           translations['kz'] || 
           translations['en'] || 
           Object.values(translations)[0] || 
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
    hyphens: 'auto'
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
    wordWrap: 'break-word'
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <h1 style={styles}>
      {text}
    </h1>
  );
};

export default TitleBlock;