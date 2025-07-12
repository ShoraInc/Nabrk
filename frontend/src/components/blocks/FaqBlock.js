import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import useMobileDetection from '../../hooks/useMobileDetection';
import BlockRenderer from './BlockRenderer';
import blocksApi from '../../api/blocksApi';

const FaqBlock = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [childBlocks, setChildBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data } = block;
  const { translations = {}, settings = {} } = data;

  // Получаем вопрос для текущего языка
  const getQuestion = () => {
    return translations[currentLanguage] || 
           translations['kz'] || 
           translations['en'] || 
           Object.values(translations)[0] || 
           'Вопрос не задан';
  };

  const question = getQuestion();
  const animation = settings.animation || 'slide';
  const initialExpanded = settings.isExpanded ?? false;

  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);

  useEffect(() => {
    if (isExpanded) {
      loadChildBlocks();
    }
  }, [isExpanded, block.id]);

  const loadChildBlocks = async () => {
    if (childBlocks.length > 0) return; // Уже загружены

    try {
      setLoading(true);
      setError(null);
      
      const response = await blocksApi.getChildBlocks(block.id, 'faq_answer');
      setChildBlocks(response.childBlocks || []);
    } catch (err) {
      console.error('Error loading child blocks:', err);
      setError('Ошибка при загрузке ответа');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Стили для анимации
  const getAnimationStyles = () => {
    switch (animation) {
      case 'slide':
        return {
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden'
        };
      case 'fade':
        return {
          transition: 'opacity 0.3s ease-in-out',
          opacity: isExpanded ? 1 : 0
        };
      default:
        return {};
    }
  };

  // Стили для мобильной и десктопной версии
  const mobileStyles = {
    container: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      margin: '16px 0',
      backgroundColor: '#ffffff'
    },
    header: {
      padding: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none'
    },
    question: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#374151',
      margin: 0,
      flex: 1,
      textAlign: 'left'
    },
    content: {
      padding: '16px',
      backgroundColor: '#f9fafb'
    }
  };

  const desktopStyles = {
    container: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      margin: '24px 0',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    header: {
      padding: '20px 24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none'
    },
    question: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#374151',
      margin: 0,
      flex: 1,
      textAlign: 'left'
    },
    content: {
      padding: '24px',
      backgroundColor: '#f9fafb'
    }
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <div style={styles.container}>
      {/* Заголовок FAQ */}
      <div 
        style={styles.header}
        onClick={handleToggle}
        className="hover:bg-gray-50 transition-colors"
      >
        <h3 style={styles.question}>
          {question}
        </h3>
        
        {/* Иконка стрелки */}
        <div 
          className={`transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            className="text-gray-500"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>

      {/* Содержимое FAQ */}
      {isExpanded && (
        <div 
          style={{
            ...styles.content,
            ...getAnimationStyles()
          }}
        >
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-600">Загрузка ответа...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && childBlocks.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📝</div>
              <div>Ответ не настроен</div>
              <div className="text-sm">Обратитесь к администратору</div>
            </div>
          )}

          {!loading && !error && childBlocks.length > 0 && (
            <div className="space-y-4">
              {childBlocks.map((childBlock) => (
                <div key={childBlock.relationId}>
                  <BlockRenderer
                    block={childBlock.block}
                    currentLanguage={currentLanguage}
                    isMobile={isMobile}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaqBlock;