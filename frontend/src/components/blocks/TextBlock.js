// components/blocks/TextBlock.js

import React from 'react';

const TextBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const { data } = block;
  const { 
    translations = {}, 
    fontSize = '16px', 
    fontWeight = '400',
    textColor = '#000000',
    textAlign = 'left',
    marginTop = 0,
    marginBottom = 16
  } = data;

  // Получаем текст для текущего языка с фоллбэком
  const getText = () => {
    const fallbackOrder = ['kz', 'ru', 'en'];
    
    // Сначала пробуем текущий язык
    if (translations[currentLanguage] && translations[currentLanguage].trim()) {
      return translations[currentLanguage];
    }
    
    // Затем пробуем языки по порядку
    for (const lang of fallbackOrder) {
      if (translations[lang] && translations[lang].trim()) {
        return translations[lang];
      }
    }
    
    // Если ничего не найдено, берем любой доступный
    const availableTexts = Object.values(translations).filter(Boolean);
    return availableTexts.length > 0 ? availableTexts[0] : '';
  };

  const text = getText();

  // Если нет текста - не рендерим блок
  if (!text) {
    return null;
  }

  // Стили для контейнера
  const containerStyles = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    width: '100%',
  };

  // Стили для текста
  const textStyles = {
    fontSize: isMobile ? 
      // На мобильных немного уменьшаем размер
      (parseInt(fontSize) > 16 ? `${parseInt(fontSize) - 2}px` : fontSize) : 
      fontSize,
    fontWeight: fontWeight,
    color: textColor,
    textAlign: textAlign,
    lineHeight: '1.6', // Хорошая читаемость
    margin: 0,
    padding: 0,
    fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif",
    // Переносим длинные слова
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
  };

  return (
    <div style={containerStyles}>
      <p style={textStyles}>
        {text}
      </p>
    </div>
  );
};

export default TextBlock;
