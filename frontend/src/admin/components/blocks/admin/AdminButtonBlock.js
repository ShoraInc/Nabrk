// admin/components/blocks/admin/AdminButtonBlock.js
import React from 'react';

const AdminButtonBlock = ({ block, isMobile = false }) => {
  const { data } = block;
  const { translations = {}, url = '', width = '100%', backgroundColor = '#D4AF37', textColor = '#000000' } = data;

  // Получаем все доступные переводы
  const getTranslationsInfo = () => {
    const availableLanguages = Object.keys(translations).length;
    const languageLabels = {
      'en': 'EN',
      'ru': 'RU', 
      'kz': 'KZ'
    };

    return {
      available: availableLanguages,
      languages: Object.keys(translations).map(lang => languageLabels[lang] || lang.toUpperCase()).join(', ')
    };
  };

  // Получаем текст для предпросмотра (берем первый доступный)
  const getText = () => {
    // Приоритет: kz -> ru -> en -> любой другой
    return translations['kz'] ||
           translations['ru'] ||
           translations['en'] ||
           Object.values(translations).find(Boolean) ||
           'Текст кнопки';
  };

  const text = getText();
  const translationsInfo = getTranslationsInfo();

  // Стили для предпросмотра кнопки
  const buttonStyles = {
    width: isMobile ? '90%' : width,
    maxWidth: '200px', // Ограничиваем для предпросмотра
    padding: isMobile ? '8px 12px' : '12px 16px',
    backgroundColor: backgroundColor,
    color: textColor,
    border: 'none',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif",
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '1.2',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div className="space-y-2">
      {/* Предпросмотр кнопки */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button style={buttonStyles}>
          {text}
        </button>
      </div>
      
      {/* Информация о блоке */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Переводы */}
          <div>
            <strong>Переводы:</strong> {translationsInfo.languages || 'Нет'}
            <span className="ml-1 text-green-600">({translationsInfo.available})</span>
          </div>
          
          {/* URL */}
          <div>
            <strong>Ссылка:</strong> 
            <span className="ml-1">
              {url ? (
                <span className="text-blue-600" title={url}>
                  {url.length > 20 ? `${url.substring(0, 20)}...` : url}
                </span>
              ) : (
                <span className="text-gray-400">Не указана</span>
              )}
            </span>
          </div>
          
          {/* Ширина */}
          <div>
            <strong>Ширина:</strong> 
            <span className="ml-1 text-purple-600">{width}</span>
          </div>
          
          {/* Цвета */}
          <div>
            <strong>Цвета:</strong>
            <span className="ml-1">
              <span 
                className="inline-block w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: backgroundColor }}
                title={`Фон: ${backgroundColor}`}
              ></span>
              <span className="mx-1">/</span>
              <span 
                className="inline-block w-3 h-3 rounded border border-gray-300"
                style={{ backgroundColor: textColor }}
                title={`Текст: ${textColor}`}
              ></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminButtonBlock;
