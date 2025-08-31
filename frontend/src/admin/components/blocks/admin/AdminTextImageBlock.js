// components/admin/blocks/admin/AdminTextImageBlock.js
import React from 'react';

const AdminTextImageBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const { data } = block;
  const { translations = {}, imageUrl, imagePosition = 'left' } = data;

  // Формируем полный URL для изображения
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url; // Уже полный URL
    return `${process.env.REACT_APP_API_URL}${url}`; // Добавляем базовый URL
  };

  const fullImageUrl = getImageUrl(imageUrl);

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

  // Компактные стили для предпросмотра в админке
  const containerStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    flexDirection: isMobile ? 'column' : 'row',
    fontSize: '12px',
    color: '#374151',
    maxWidth: '100%',
    fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif"
  };

  const imageStyles = {
    maxWidth: '80px',
    maxHeight: '60px',
    borderRadius: '4px',
    objectFit: 'cover',
    flexShrink: 0,
    order: isMobile ? 0 : (imagePosition === 'right' ? 1 : 0)
  };

  const textStyles = {
    flex: 1,
    lineHeight: '1.3',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 400,
    order: isMobile ? 1 : (imagePosition === 'right' ? 0 : 1)
  };

  // Если нет ни текста, ни изображения
  if (!text && !fullImageUrl) {
    return (
      <div className="text-gray-400 text-xs italic">
        Блок без содержимого
      </div>
    );
  }

  // Если только изображение без текста
  if (fullImageUrl && !text) {
    return (
      <div style={{ textAlign: 'center' }}>
        <img 
          src={fullImageUrl} 
          alt="Preview"
          style={{
            ...imageStyles,
            maxWidth: '120px',
            maxHeight: '80px'
          }}
        />
        <div className="text-xs text-gray-500 mt-1">
          📷 Только изображение
        </div>
      </div>
    );
  }

  // Если только текст без изображения
  if (text && !fullImageUrl) {
    return (
      <div>
        <p style={textStyles}>
          {text}
        </p>
        <div className="text-xs text-gray-500 mt-1">
          📝 Только текст
        </div>
      </div>
    );
  }

  // Если есть и текст, и изображение
  return (
    <div>
      <div style={containerStyles}>
        {fullImageUrl && (
          <img 
            src={fullImageUrl} 
            alt="Preview"
            style={imageStyles}
          />
        )}
        <p style={textStyles}>
          {text}
        </p>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        📝🖼️ Текст + изображение ({imagePosition === 'left' ? 'слева' : 'справа'})
      </div>
    </div>
  );
};

export default AdminTextImageBlock;
