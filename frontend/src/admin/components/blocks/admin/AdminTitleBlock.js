// components/admin/blocks/AdminTitleBlock.js
import React from 'react';

const AdminTitleBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const { data } = block;
  const { translations = {} } = data;

  // Получаем текст для текущего языка с фоллбэком
  const getText = () => {
    return translations[currentLanguage] || 
           translations['kz'] || 
           translations['en'] || 
           Object.values(translations)[0] || 
           'Нет текста';
  };

  const text = getText();

  // Стили как в обычном TitleBlock, но с некоторыми отличиями для админки
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

  const desktopStyles = {
    fontSize: data.fontSize || '24px',
    fontWeight: data.fontWeight || '600',
    color: data.color || '#333333',
    textAlign: data.textAlign || 'left',
    marginTop: `${data.marginTop || 0}px`,
    marginBottom: `${data.marginBottom || 0}px`,
    lineHeight: '1.3',
    padding: 0,
    letterSpacing: '-0.01em',
    wordWrap: 'break-word'
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <div className="space-y-2">
      {/* Сам заголовок */}
      <h1 style={styles}>
        {text}
      </h1>
      
      {/* Информация о переводах */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <div className="mb-1">
          <strong>Доступные переводы:</strong>
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.keys(translations).length > 0 ? (
            Object.entries(translations).map(([lang, translation]) => (
              <span 
                key={lang} 
                className={`px-2 py-1 rounded text-xs ${
                  lang === currentLanguage 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {lang.toUpperCase()}: {translation.substring(0, 30)}
                {translation.length > 30 ? '...' : ''}
              </span>
            ))
          ) : (
            <span className="text-red-500">Нет переводов</span>
          )}
        </div>
      </div>
      
      {/* Стили блока */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <div className="grid grid-cols-2 gap-2">
          <div>Размер: {data.fontSize || '24px'}</div>
          <div>Вес: {data.fontWeight || '600'}</div>
          <div>Цвет: {data.color || '#333333'}</div>
          <div>Выравнивание: {data.textAlign || 'left'}</div>
          <div>Отступ сверху: {data.marginTop || 0}px</div>
          <div>Отступ снизу: {data.marginBottom || 0}px</div>
        </div>
      </div>
    </div>
  );
};

export default AdminTitleBlock;