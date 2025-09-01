// admin/components/blocks/admin/AdminImageBlock.js

import React from 'react';

const AdminImageBlock = ({ block }) => {
  const { data } = block;
  const {
    displayMode = 'single',
    aspectRatio = 'auto',
    alignment = 'center',
    images = [],
    sliderOptions = {}
  } = data;

  // Функция для получения полного URL изображения
  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.url) {
      const baseUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
      return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
    }
    return '';
  };

  // Стили контейнера
  const containerStyles = {
    fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif",
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  // Стили для изображений в превью
  const previewImageStyles = {
    width: '100%',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
  };

  if (!images || images.length === 0) {
    return (
      <div style={containerStyles}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <span style={{ marginRight: '8px', fontSize: '20px' }}>🖼️</span>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '2px' }}>
              Изображения ({displayMode})
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              Нет изображений
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getModeIcon = () => {
    switch (displayMode) {
      case 'gallery': return '🖼️';
      case 'slider': return '🎠';
      case 'single':
      default: return '🖼️';
    }
  };

  const getModeLabel = () => {
    switch (displayMode) {
      case 'gallery': return 'Галерея';
      case 'slider': return 'Слайдер';
      case 'single': return 'Одно изображение';
      default: return displayMode;
    }
  };

  return (
    <div style={containerStyles}>
      {/* Заголовок */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151'
      }}>
        <span style={{ marginRight: '8px', fontSize: '18px' }}>
          {getModeIcon()}
        </span>
        <div>
          <div>{getModeLabel()}</div>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400' }}>
            {images.length} изображени{images.length === 1 ? 'е' : images.length < 5 ? 'я' : 'й'}
            {aspectRatio !== 'auto' && ` • ${aspectRatio}`}
            {alignment !== 'center' && ` • ${alignment === 'left' ? 'слева' : 'справа'}`}
          </div>
        </div>
      </div>

      {/* Превью изображений с новой логикой галереи */}
      <div style={{
        display: displayMode === 'single' ? 'block' : 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '8px'
      }}>
        {images.slice(0, displayMode === 'single' ? 1 : Math.min(6, images.length)).map((image, index) => {
          // Логика размеров для превью (упрощенная версия)
          let previewWidth;
          let previewHeight = '50px';
          
          if (displayMode === 'single') {
            previewWidth = '100%';
            previewHeight = '80px';
          } else if (displayMode === 'gallery') {
            // Все изображения одинакового размера - по 50%
            previewWidth = 'calc(50% - 3px)';
            previewHeight = '45px';
          } else {
            // Слайдер - показываем все одинакового размера
            previewWidth = 'calc(25% - 4px)';
            previewHeight = '40px';
          }

          return (
            <div key={index} style={{ 
              position: 'relative',
              width: previewWidth,
              height: previewHeight,
              overflow: 'hidden',
              borderRadius: '4px',
              border: '1px solid #d1d5db'
            }}>
              <img
                src={getImageUrl(image)}
                alt={image.alt || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback если изображение не загрузилось */}
              <div style={{
                display: 'none',
                width: '100%',
                height: '100%',
                backgroundColor: '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#9ca3af'
              }}>
                🖼️
              </div>
              
              {/* Показываем подпись если есть */}
              {image.caption && (
                <div style={{
                  position: 'absolute',
                  bottom: '1px',
                  left: '1px',
                  right: '1px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  fontSize: '9px',
                  padding: '1px 3px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }}>
                  {image.caption}
                </div>
              )}
              

            </div>
          );
        })}
        
        {/* Показываем "+N" если изображений больше чем отображается */}
        {images.length > 6 && displayMode !== 'single' && (
          <div style={{
            width: displayMode === 'gallery' ? 'calc(25% - 4px)' : 'calc(25% - 4px)',
            height: displayMode === 'gallery' ? '35px' : '40px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '500',
            color: '#6b7280'
          }}>
            +{images.length - 6}
          </div>
        )}
      </div>

      {/* Дополнительная информация для слайдера */}
      {displayMode === 'slider' && (
        <div style={{
          fontSize: '11px',
          color: '#6b7280',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {sliderOptions.autoPlay && (
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              Автопроигрывание
            </span>
          )}
          {sliderOptions.showDots && (
            <span style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              Точки
            </span>
          )}
          {sliderOptions.showArrows && (
            <span style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              Стрелки
            </span>
          )}
          {sliderOptions.slideSpeed && (
            <span style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {sliderOptions.slideSpeed / 1000}с
            </span>
          )}
        </div>
      )}

      {/* Информация об отступах */}
      {(data.marginTop > 0 || data.marginBottom !== 16) && (
        <div style={{
          fontSize: '11px',
          color: '#9ca3af',
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #e5e7eb'
        }}>
          Отступы: {data.marginTop || 0}px / {data.marginBottom || 16}px
        </div>
      )}
    </div>
  );
};

export default AdminImageBlock;
