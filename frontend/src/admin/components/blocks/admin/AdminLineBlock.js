// components/admin/blocks/AdminLineBlock.js
import React from 'react';

const AdminLineBlock = ({ block, isMobile = false }) => {
  const { data } = block;

  // Стили как в обычном LineBlock
  const desktopStyles = {
    width: data.width || '100%',
    height: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    borderTop: `${data.height || 1}px ${data.style || 'solid'} ${data.color || '#000000'}`,
    marginTop: `${data.marginTop || 0}px`,
    marginBottom: `${data.marginBottom || 0}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 0
  };

  const mobileStyles = {
    width: '100%',
    height: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    borderTop: `1px ${data.style || 'solid'} ${data.color || '#000000'}`,
    marginTop: '8px',
    marginBottom: '8px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 0
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <div className="space-y-2">
      {/* Сама линия */}
      <hr style={styles} />
      
      {/* Информация о линии */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <div className="grid grid-cols-2 gap-2">
          <div>Цвет: {data.color || '#000000'}</div>
          <div>Стиль: {data.style || 'solid'}</div>
          <div>Ширина: {data.width || '100%'}</div>
          <div>Высота: {data.height || 1}px</div>
          <div>Отступ сверху: {data.marginTop || 0}px</div>
          <div>Отступ снизу: {data.marginBottom || 0}px</div>
        </div>
      </div>
      
      {/* Адаптивность */}
      <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
        <div className="flex items-center">
          <span className="mr-2">📱</span>
          <span>
            На мобильных устройствах: ширина 100%, высота 1px, отступы 8px
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLineBlock;