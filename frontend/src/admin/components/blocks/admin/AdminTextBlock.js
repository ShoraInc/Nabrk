// admin/components/blocks/admin/AdminTextBlock.js

import React from 'react';

const AdminTextBlock = ({ block, currentLanguage = 'kz' }) => {
  const { data } = block;
  const { 
    translations = {}, 
    fontSize = '16px', 
    fontWeight = '400',
    textColor = '#000000',
    textAlign = 'left',
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
    return availableTexts.length > 0 ? availableTexts[0] : 'Нет текста';
  };

  const text = getText();

  // Получаем информацию о переводах
  const getTranslationsInfo = () => {
    const availableLanguages = Object.keys(translations).filter(lang => 
      translations[lang] && translations[lang].trim()
    );
    
    const languageNames = {
      'kz': 'ҚЗ',
      'ru': 'РУ', 
      'en': 'EN'
    };
    
    return availableLanguages.map(lang => languageNames[lang] || lang).join(', ');
  };

  // Стили для контейнера (компактный вид для админки)
  const containerStyles = {
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    fontFamily: "'Roboto Flex', sans-serif",
    fontSize: '14px',
    lineHeight: '1.4',
  };

  // Стили для превью текста (ограниченный размер)
  const textStyles = {
    fontSize: fontSize === '32px' ? '18px' : 
              fontSize === '28px' ? '16px' :
              fontSize === '24px' ? '14px' :
              '12px', // Уменьшаем для компактности
    fontWeight: fontWeight,
    color: textColor,
    textAlign: textAlign,
    margin: 0,
    padding: 0,
    fontFamily: "'Roboto Flex', sans-serif",
    lineHeight: '1.5',
    // Ограничиваем текст
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    wordWrap: 'break-word',
  };

  const metaStyles = {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const badgeStyles = {
    fontSize: '10px',
    padding: '2px 6px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '4px',
    fontWeight: '500',
  };

  return (
    <div style={containerStyles}>
      {/* Превью текста */}
      <div style={textStyles}>
        {text}
      </div>
      
      {/* Метаинформация */}
      <div style={metaStyles}>
        <div>
          <span style={badgeStyles}>
            {fontSize} · {fontWeight === '400' ? 'Обычный' : 
                        fontWeight === '500' ? 'Средний' :
                        fontWeight === '600' ? 'Полужирный' :
                        fontWeight === '700' ? 'Жирный' : fontWeight}
          </span>
        </div>
        <div>
          {getTranslationsInfo() && (
            <span style={{ fontSize: '10px', color: '#10b981' }}>
              {getTranslationsInfo()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTextBlock;
