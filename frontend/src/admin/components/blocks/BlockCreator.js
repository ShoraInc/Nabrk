// components/admin/blocks/BlockCreator.js
import React, { useState } from 'react';
import { BLOCK_TYPES_CONFIG, blockUtils } from '../../../config/blockTypesConfig';

const BlockCreator = ({ 
  pageId, 
  editingBlock, 
  order,
  onBlockCreated, 
  onBlockUpdated, 
  onCancel,
  selectedType = '',
  isChildBlock = false
}) => {
  const [selectedTypeState, setSelectedTypeState] = useState(editingBlock?.type || selectedType);
  const [showForm, setShowForm] = useState(!!editingBlock || !!selectedType);
  const isEditing = !!editingBlock;

  const handleTypeSelect = (type) => {
    setSelectedTypeState(type);
    setShowForm(true);
  };

  const handleFormSubmit = (blockData) => {
    if (isEditing) {
      onBlockUpdated(blockData);
    } else {
      onBlockCreated(blockData);
    }
  };

  const handleCancel = () => {
    setSelectedTypeState('');
    setShowForm(false);
    onCancel();
  };

  // Группируем блоки по категориям
  const categoriesWithBlocks = blockUtils.getCategoriesWithBlocks();

  if (showForm && selectedTypeState) {
    const config = BLOCK_TYPES_CONFIG[selectedTypeState];
    const FormComponent = config?.FormComponent;

    if (!FormComponent) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Форма для типа блока "{selectedTypeState}" не найдена
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditing ? 'Редактировать' : 'Создать'} {config.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {config.description}
          </p>
        </div>
        <div className="p-6">
          
          <FormComponent
            pageId={pageId}
            editingBlock={editingBlock}
            isEditing={isEditing}
            order={order}
            onSubmit={handleFormSubmit}
            onBlockCreated={onBlockCreated}
            onBlockUpdated={onBlockUpdated}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-6xl mx-auto">
      {/* Заголовок с градиентом */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              ✨ Выберите тип блока
            </h3>
            <p className="text-blue-100 text-sm">
              Создайте контент для вашей страницы • Выберите подходящий тип блока
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <span className="text-3xl">🎨</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {Object.entries(categoriesWithBlocks).map(([categoryKey, category]) => (
          <div key={categoryKey} className="mb-10 last:mb-0">
            {/* Заголовок категории с улучшенным дизайном */}
            <div className="flex items-center mb-6 pb-3 border-b border-gray-100">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full p-3 mr-4">
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Блоки в категории с улучшенным дизайном */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {category.blocks.map(({ type, name, description, icon }) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className="group relative text-left p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Фоновый градиент при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Контент карточки */}
                  <div className="relative z-10">
                    <div className="flex items-start mb-3">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-2 mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{icon}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-lg">
                          {name}
                        </h5>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {description}
                    </p>
                    
                    {/* Индикатор действия */}
                    <div className="flex items-center mt-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-medium">Создать блок</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

      </div>
      
      {/* Подвал с дополнительной информацией и кнопкой отмены */}
      <div className="bg-gray-50 px-8 py-6 rounded-b-xl border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>💡 Совет: Начните с простых блоков, затем добавляйте более сложные</span>
            <span className="hidden md:inline ml-4">
              Всего типов блоков: {Object.values(categoriesWithBlocks).reduce((acc, cat) => acc + cat.blocks.length, 0)}
            </span>
          </div>
          <button
            onClick={handleCancel}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            ← Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockCreator;