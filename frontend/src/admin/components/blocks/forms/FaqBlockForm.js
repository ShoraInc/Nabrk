import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { BLOCK_TYPES_CONFIG } from '../../../../config/blockTypesConfig';
import blocksApi from '../../../../api/blocksApi';
import faqBlocksApi from '../../../../api/faqBlocksApi';

const FaqBlockForm = ({ 
  pageId, 
  editingBlock = null, 
  onBlockCreated, 
  onBlockUpdated, 
  onSubmit,
  onCancel,
  isHidden = false
}) => {
  const { currentLanguage, languages } = useLanguage();
  const [question, setQuestion] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation, setAnimation] = useState('slide');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Для дочерних блоков (только при редактировании)
  const [childBlocks, setChildBlocks] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [showBlockSelector, setShowBlockSelector] = useState(false);

  useEffect(() => {
    if (editingBlock) {
      // Загружаем данные для редактирования
      const data = editingBlock.data || {};
      setQuestion(data.translations?.[currentLanguage] || '');
      setIsExpanded(data.settings?.isExpanded || false);
      setAnimation(data.settings?.animation || 'slide');
      
      // Загружаем дочерние блоки
      loadChildBlocks();
      loadAvailableBlocks();
    }
  }, [editingBlock, currentLanguage]);

  const loadChildBlocks = async () => {
    if (!editingBlock) return;
    
    try {
      const response = await faqBlocksApi.getChildBlocks(editingBlock.id);
      setChildBlocks(response.childBlocks || []);
    } catch (err) {
      console.error('Error loading child blocks:', err);
    }
  };

  const loadAvailableBlocks = async () => {
    try {
      const response = await faqBlocksApi.getBlocksByPageSlug(parseInt(pageId));
      // Фильтруем блоки, исключая текущий FAQ блок и уже добавленные
      const filteredBlocks = response.filter(block => 
        block.id !== editingBlock?.id && 
        !childBlocks.find(child => child.block.id === block.id)
      );
      setAvailableBlocks(filteredBlocks);
    } catch (err) {
      console.error('Error loading available blocks:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Вопрос не может быть пустым');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blockData = {
        type: 'faq',
        data: {
          translations: {
            [currentLanguage]: question
          },
          settings: {
            isExpanded,
            animation
          }
        }
      };

      let result;
      if (editingBlock) {
        result = await faqBlocksApi.updateFaqBlock(editingBlock.id, blockData);
        // Поддерживаем оба варианта
        if (onBlockUpdated) {
          onBlockUpdated(result);
        } else if (onSubmit) {
          onSubmit(result);
        }
      } else {
        // Добавляем флаг скрытого блока
        const blockDataWithHidden = {
          ...blockData,
          isHidden: isHidden
        };
        result = await faqBlocksApi.createFaqBlock(parseInt(pageId), blockDataWithHidden);
        // Поддерживаем оба варианта
        if (onBlockCreated) {
          onBlockCreated(result);
        } else if (onSubmit) {
          onSubmit(result);
        }
      }
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении блока');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChildBlock = async (childBlockId) => {
    if (!editingBlock) return;
    
    try {
      await faqBlocksApi.addChildBlock(editingBlock.id, {
        childBlockId,
        relationType: 'faq_answer'
      });
      
      // Перезагружаем дочерние блоки и доступные блоки
      await loadChildBlocks();
      await loadAvailableBlocks();
      setShowBlockSelector(false);
    } catch (err) {
      setError(err.message || 'Ошибка при добавлении блока');
    }
  };

  const handleRemoveChildBlock = async (childBlockId) => {
    if (!editingBlock) return;
    
    try {
      await faqBlocksApi.removeChildBlock(editingBlock.id, childBlockId, {
        relationType: 'faq_answer'
      });
      
      // Перезагружаем дочерние блоки и доступные блоки
      await loadChildBlocks();
      await loadAvailableBlocks();
    } catch (err) {
      setError(err.message || 'Ошибка при удалении блока');
    }
  };

  const handleReorderChildBlocks = async (newOrder) => {
    if (!editingBlock) return;
    
    try {
      // Обновляем порядок всех дочерних блоков
      const updatePromises = newOrder.map((childBlock, index) => 
        faqBlocksApi.updateChildBlockOrder(editingBlock.id, childBlock.block.id, {
          orderIndex: index,
          relationType: 'faq_answer'
        })
      );
      
      await Promise.all(updatePromises);
      await loadChildBlocks();
    } catch (err) {
      setError(err.message || 'Ошибка при изменении порядка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingBlock ? 'Редактировать FAQ блок' : 'Создать FAQ блок'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Вопрос */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Вопрос ({languages[currentLanguage]?.name})
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Введите вопрос..."
            required
          />
        </div>

        {/* Настройки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Начальное состояние
            </label>
            <select
              value={isExpanded ? 'expanded' : 'collapsed'}
              onChange={(e) => setIsExpanded(e.target.value === 'expanded')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="expanded">Развернут</option>
              <option value="collapsed">Свернут</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Анимация
            </label>
            <select
              value={animation}
              onChange={(e) => setAnimation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="slide">Слайд</option>
              <option value="fade">Плавное появление</option>
              <option value="none">Без анимации</option>
            </select>
          </div>
        </div>

        {/* Дочерние блоки (только при редактировании) */}
        {editingBlock && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Ответы ({childBlocks.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowBlockSelector(!showBlockSelector)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Добавить блок
              </button>
            </div>

            {/* Селектор существующих блоков */}
            {showBlockSelector && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Выберите блок для добавления в ответ:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableBlocks.map(block => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => handleAddChildBlock(block.id)}
                      className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-2 flex-shrink-0">
                          {BLOCK_TYPES_CONFIG[block.type]?.icon || '❓'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-800 truncate">
                            {BLOCK_TYPES_CONFIG[block.type]?.name || block.type}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {block.data?.translations?.[currentLanguage] || 'Без названия'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {availableBlocks.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Нет доступных блоков для добавления
                  </div>
                )}
              </div>
            )}

            {/* Список дочерних блоков */}
            <div className="space-y-2">
              {childBlocks.map((childBlock, index) => (
                <div
                  key={childBlock.relationId}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-lg mr-3 flex-shrink-0">
                      {BLOCK_TYPES_CONFIG[childBlock.block.type]?.icon || '❓'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {BLOCK_TYPES_CONFIG[childBlock.block.type]?.name || childBlock.block.type}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {childBlock.block.data?.translations?.[currentLanguage] || 'Без названия'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChildBlock(childBlock.block.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Удалить из ответа"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              {childBlocks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <div>Нет добавленных ответов</div>
                  <div className="text-sm">Создайте скрытые блоки и добавьте их сюда</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : (editingBlock ? 'Обновить' : 'Создать')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaqBlockForm;