// components/admin/blocks/BlockCreator.js
import React, { useState } from 'react';
import { BLOCK_TYPES_CONFIG, blockUtils } from '../../../config/blockTypesConfig';

const BlockCreator = ({ 
  pageId, 
  editingBlock, 
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
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Выберите тип блока
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Выберите тип контента, который хотите добавить на страницу
        </p>
      </div>

      <div className="p-6">
        {Object.entries(categoriesWithBlocks).map(([categoryKey, category]) => (
          <div key={categoryKey} className="mb-8 last:mb-0">
            {/* Заголовок категории */}
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{category.icon}</span>
              <h4 className="text-lg font-semibold text-gray-700">
                {category.name}
              </h4>
            </div>

            {/* Блоки в категории */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.blocks.map(({ type, name, description, icon }) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-start">
                    <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">
                      {icon}
                    </span>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 group-hover:text-blue-600">
                        {name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Кнопка отмены */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockCreator;