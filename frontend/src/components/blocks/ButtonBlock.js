// components/blocks/ButtonBlock.js

import React from 'react';
import arrowUpRight from '../../assets/icons/Arrow-up-right.png';

const ButtonBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const { data } = block;
  const { translations = {}, url = '', width = '100%', backgroundColor = '#D4AF37', textColor = '#000000', fontWeight = '600' } = data;

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

  // Если нет текста - не рендерим блок
  if (!text) {
    return null;
  }

  // Стили для контейнера
  const containerStyles = {
    marginTop: `${data.marginTop || 0}px`,
    marginBottom: `${data.marginBottom || 16}px`,
    width: '100%',
    display: 'flex',
    justifyContent: 'left', // Центрируем кнопку
  };


  // Стили для кнопки
  const buttonStyles = {
    position: 'relative', // Для абсолютного позиционирования иконки
    display: 'flex',
    alignItems: 'flex-end', // Текст внизу
    justifyContent: 'flex-start', // Текст слева
    width: isMobile ? '90%' : width, // На мобильных ограничиваем до 90%
    minWidth: '120px',
    minHeight: isMobile ? '48px' : '56px', // Минимальная высота для размещения иконки и текста
    padding: isMobile ? '12px 32px 12px 16px' : '16px 40px 16px 24px', // Больше отступ справа для иконки
    backgroundColor: backgroundColor,
    color: textColor,
    border: 'none',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: fontWeight,
    fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif",
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'left', // Текст по левому краю
    lineHeight: '1.2',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    // Эффект наведения через псевдо-класс
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    }
  };

  // Стили для иконки - позиционируем в правом верхнем углу
  const iconStyles = {
    position: 'absolute',
    top: isMobile ? '8px' : '12px',
    right: isMobile ? '8px' : '12px',
    width: '16px',
    height: '16px',
  };

  // Обработчик клика
  const handleClick = (e) => {
    if (!url) {
      e.preventDefault();
      return;
    }

    // Если внешняя ссылка - открываем в новой вкладке
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener noreferrer');
      e.preventDefault();
    }
    // Для внутренних ссылок позволяем стандартному поведению работать
  };

  // Если есть URL - рендерим как ссылку, иначе как кнопку
  if (url) {
    return (
      <div style={containerStyles}>
        <a
          href={url}
          style={buttonStyles}
          onClick={handleClick}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          {text}
          <img src={arrowUpRight} alt="Arrow Up Right" style={iconStyles} />
        </a>
      </div>
    );
  }

  // Если нет URL - просто кнопка без действия
  return (
    <div style={containerStyles}>
      <button
        style={buttonStyles}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }}
      >
        {text}
        <img src={arrowUpRight} alt="Arrow Up Right" style={iconStyles} />
      </button>
    </div>
  );
};

export default ButtonBlock;
