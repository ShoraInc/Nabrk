import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import useMobileDetection from '../../../../hooks/useMobileDetection';
import BlockRenderer from '../../../../components/blocks/BlockRenderer';
import blocksApi from '../../../../api/blocksApi';

const AdminFaqBlock = ({ block, currentLanguage = 'kz' }) => {
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

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Заголовок FAQ */}
      <div 
        className="px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800 text-sm">
            {question}
          </h3>
          
          {/* Иконка стрелки */}
          <div 
            className={`transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            <svg 
              width="16" 
              height="16" 
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
        
        {/* Информация о настройках */}
        <div className="mt-2 text-xs text-gray-500">
          <span className="mr-3">Анимация: {animation}</span>
          <span>Начальное состояние: {initialExpanded ? 'Развернут' : 'Свернут'}</span>
        </div>
      </div>

      {/* Содержимое FAQ */}
      {isExpanded && (
        <div className="p-4 bg-white">
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-600 text-sm">Загрузка ответа...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {!loading && !error && childBlocks.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-sm">Ответ не настроен</div>
            </div>
          )}

          {!loading && !error && childBlocks.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 mb-2">
                Ответы ({childBlocks.length}):
              </div>
              {childBlocks.map((childBlock, index) => (
                <div key={childBlock.relationId} className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="flex items-center mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                      #{index + 1}
                    </span>
                    <span className="text-xs text-gray-600">
                      {childBlock.block.type}
                    </span>
                  </div>
                  <BlockRenderer
                    block={childBlock.block}
                    currentLanguage={currentLanguage}
                    isMobile={false}
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

export default AdminFaqBlock;