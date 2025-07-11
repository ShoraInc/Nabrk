// components/blocks/LineBlock.js
import React from 'react';

const LineBlock = ({ block, isMobile = false }) => {
  const { data } = block;

  // Стили для десктопа (из БД)
  const desktopStyles = {
    width: data.width || '100%',
    height: '0px', // всегда 0, так как используем border-top
    backgroundColor: 'transparent',
    border: 'none',
    borderTop: `${data.height || 1}px ${data.style || 'solid'} ${data.color || '#000000'}`,
    marginTop: `${data.marginTop || 0}px`,
    marginBottom: `${data.marginBottom || 0}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 0
  };

  // Базовые стили для мобильных устройств
  const mobileStyles = {
    width: '100%', // фиксированная ширина для адаптивности
    height: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    borderTop: `1px ${data.style || 'solid'} ${data.color || '#000000'}`, // цвет и стиль берем из данных
    marginTop: '8px', // фиксированные отступы для адаптивности
    marginBottom: '8px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 0
  };

  // Выбираем стили в зависимости от устройства
  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <hr style={styles} />
  );
};

export default LineBlock;