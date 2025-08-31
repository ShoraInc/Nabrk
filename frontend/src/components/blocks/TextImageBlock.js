// components/blocks/TextImageBlock.js

import React from 'react';

const TextImageBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const { data } = block;
  const { translations = {}, imageUrl, imagePosition = 'left' } = data;

  // Формируем полный URL для изображения
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url; // Уже полный URL
    return `${process.env.REACT_APP_API_URL}${url}`; // Добавляем базовый URL
  };

  const fullImageUrl = getImageUrl(imageUrl);

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

  // Если нет ни текста, ни изображения - не рендерим блок
  if (!text && !fullImageUrl) {
    return null;
  }

  // Базовые стили для контейнера
  const containerStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: isMobile ? '12px' : '20px',
    marginTop: `${data.marginTop || 0}px`,
    marginBottom: `${data.marginBottom || 16}px`,
    flexDirection: isMobile ? 'column' : 'row',
    width: '100%'
  };

  // Стили для изображения
  const imageStyles = {
    maxWidth: isMobile ? '100%' : '300px',
    height: 'auto',
    borderRadius: '8px',
    objectFit: 'cover',
    flexShrink: 0,
    order: isMobile ? 0 : (imagePosition === 'right' ? 1 : 0)
  };

  // Стили для текста
  const textStyles = {
    flex: 1,
    fontSize: isMobile ? '14px' : '16px',
    lineHeight: '1.6',
    color: '#333333',
    margin: 0,
    padding: 0,
    wordWrap: 'break-word',
    hyphens: 'auto',
    fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 400,
    order: isMobile ? 1 : (imagePosition === 'right' ? 0 : 1)
  };

  // Если только изображение без текста
  if (fullImageUrl && !text) {
    return (
      <div style={{ 
        marginTop: `${data.marginTop || 0}px`,
        marginBottom: `${data.marginBottom || 16}px`,
        textAlign: 'center'
      }}>
        <img 
          src={fullImageUrl} 
          alt=""
          style={{
            ...imageStyles,
            maxWidth: isMobile ? '100%' : '500px'
          }}
        />
      </div>
    );
  }

  // Если только текст без изображения
  if (text && !fullImageUrl) {
    return (
      <div style={{
        marginTop: `${data.marginTop || 0}px`,
        marginBottom: `${data.marginBottom || 16}px`
      }}>
        <p style={textStyles}>
          {text}
        </p>
      </div>
    );
  }

  // Если есть и текст, и изображение
  return (
    <div style={containerStyles}>
      {fullImageUrl && (
        <img 
          src={fullImageUrl} 
          alt=""
          style={imageStyles}
        />
      )}
      <p style={textStyles}>
        {text}
      </p>
    </div>
  );
};

export default TextImageBlock;
