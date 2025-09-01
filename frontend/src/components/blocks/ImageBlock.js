// components/blocks/ImageBlock.js

import React, { useState, useEffect } from 'react';
import useMobileDetection from '../../hooks/useMobileDetection';

const ImageBlock = ({ block, currentLanguage = 'kz' }) => {
    const { data } = block;
    const isMobile = useMobileDetection();
    const [currentSlide, setCurrentSlide] = useState(0);

    const {
        displayMode = 'single',
        aspectRatio = 'auto',
        alignment = 'center',
        marginTop = 0,
        marginBottom = 16,
        sliderOptions = {},
        images = []
    } = data;

    const {
        autoPlay = false,
        showDots = true,
        showArrows = true,
        slideSpeed = 5000
    } = sliderOptions;

    // Функция для получения полного URL изображения
    const getImageUrl = (image) => {
        if (!image) return '';
        if (image.url) {
            const baseUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
            return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
        }
        return '';
    };

    // Автопроигрывание слайдера
    useEffect(() => {
        if (displayMode === 'slider' && autoPlay && images.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % images.length);
            }, slideSpeed);

            return () => clearInterval(interval);
        }
    }, [displayMode, autoPlay, slideSpeed, images.length]);

    // Отладочная информация
    console.log('ImageBlock rendering:', { displayMode, images: images?.length || 0, data });

    // Если нет изображений - не рендерим блок
    if (!images || images.length === 0) {
        console.log('ImageBlock: No images to display');
        return null;
    }

    // Стили для контейнера
    const containerStyles = {
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        width: '100%',
        display: 'flex',
        justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        fontFamily: "'Roboto Flex', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif"
    };

    // Стили для изображений в зависимости от соотношения сторон
    const getImageStyles = (isSlider = false) => {
        const baseStyles = {
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out'
        };

        if (aspectRatio !== 'auto') {
            const ratios = {
                '16:9': '56.25%',
                '4:3': '75%',
                '1:1': '100%',
                '3:2': '66.67%'
            };

            baseStyles.aspectRatio = aspectRatio;
            baseStyles.height = ratios[aspectRatio] ? 'auto' : '300px';
        }

        if (isSlider) {
            baseStyles.maxHeight = isMobile ? '300px' : '500px';
        }

        return baseStyles;
    };

    // Навигация слайдера
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    // Рендер одного изображения
    const renderSingleImage = () => {
        const image = images[0];
        return (
            <div style={containerStyles}>
                <div style={{ position: 'relative', maxWidth: '100%' }}>
                    <img
                        src={getImageUrl(image)}
                        alt={image.alt || ''}
                        style={getImageStyles()}
                        onError={(e) => {
                            console.error('Failed to load image:', getImageUrl(image));
                            e.target.style.display = 'none';
                        }}
                    />
                    {image.caption && (
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                            color: 'white',
                            padding: '20px 16px 16px',
                            fontSize: isMobile ? '14px' : '16px',
                            borderRadius: '0 0 8px 8px'
                        }}>
                            {image.caption}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Рендер галереи с адаптивной сеткой
    const renderGallery = () => {
        return (
            <div style={containerStyles}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: isMobile ? '8px' : '16px',
                    width: '100%',
                    maxWidth: '1200px'
                }}>
                    {images.map((image, index) => {
                        // Логика размеров для адаптивной галереи
                        let imageWidth;
                        let imageHeight;
                        
                        if (isMobile) {
                            // На мобильных: все по 100% ширины (в столбик)
                            imageWidth = '100%';
                            imageHeight = '200px';
                        } else {
                            // На десктопе: все по 50% ширины (по 2 в ряд)
                            imageWidth = 'calc(50% - 8px)';
                            imageHeight = '250px';
                        }

                        return (
                            <div key={index} style={{ 
                                position: 'relative',
                                width: imageWidth,
                                height: imageHeight,
                                overflow: 'hidden',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            }}
                            >
                                <img
                                    src={getImageUrl(image)}
                                    alt={image.alt || ''}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease-in-out'
                                    }}
                                    onError={(e) => {
                                        console.error('Failed to load gallery image:', getImageUrl(image));
                                        e.target.style.display = 'none';
                                        // Показываем fallback
                                        e.target.parentElement.style.backgroundColor = '#f3f4f6';
                                        e.target.parentElement.innerHTML = `
                                            <div style="
                                                display: flex; 
                                                align-items: center; 
                                                justify-content: center; 
                                                height: 100%; 
                                                color: #9ca3af; 
                                                font-size: 14px;
                                            ">
                                                Ошибка загрузки
                                            </div>
                                        `;
                                    }}
                                />
                                
                                {/* Подпись изображения */}
                                {image.caption && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '0',
                                        right: '0',
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                        color: 'white',
                                        padding: '16px 12px 12px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        lineHeight: '1.3'
                                    }}>
                                        {image.caption}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Рендер слайдера
    const renderSlider = () => {
        const currentImage = images[currentSlide];

        return (
            <div style={containerStyles}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1200px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                    {/* Изображение */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: isMobile ? '250px' : '400px',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={getImageUrl(currentImage)}
                            alt={currentImage.alt || ''}
                            style={{
                                ...getImageStyles(true),
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                borderRadius: '0'
                            }}
                            onError={(e) => {
                                console.error('Failed to load slider image:', getImageUrl(currentImage));
                                e.target.style.display = 'none';
                            }}
                        />

                        {/* Подпись */}
                        {currentImage.caption && (
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                right: '0',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                color: 'white',
                                padding: '20px 16px 16px',
                                fontSize: isMobile ? '14px' : '16px'
                            }}>
                                {currentImage.caption}
                            </div>
                        )}

                        {/* Стрелки навигации */}
                        {showArrows && images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevSlide}
                                    style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background 0.3s ease-in-out',
                                        zIndex: 2
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                                    }}
                                >
                                    ←
                                </button>
                                <button
                                    onClick={goToNextSlide}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background 0.3s ease-in-out',
                                        zIndex: 2
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                                    }}
                                >
                                    →
                                </button>
                            </>
                        )}
                    </div>

                    {/* Точки индикации */}
                    {showDots && images.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '8px',
                            zIndex: 2
                        }}>
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s ease-in-out'
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Счетчик слайдов */}
                    {images.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            zIndex: 2
                        }}>
                            {currentSlide + 1} / {images.length}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Выбираем режим отображения
    switch (displayMode) {
        case 'gallery':
            return renderGallery();
        case 'slider':
            return renderSlider();
        case 'single':
        default:
            return renderSingleImage();
    }
};

export default ImageBlock;
