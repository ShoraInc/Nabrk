// components/admin/blocks/SortableBlockItem.js
import React, { useState } from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import { BLOCK_TYPES_CONFIG } from '../../../config/blockTypesConfig';
import BlockPreview from './BlockPreview';

const SortableBlockItem = ({ 
  block, 
  index, 
  totalBlocks,
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  isReorderLoading 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const config = BLOCK_TYPES_CONFIG[block.type];
  
  // Получаем краткую информацию о блоке
  const getBlockSummary = () => {
    switch (block.type) {
      case 'title':
        const titleText = block.data?.translations?.kz || 
                         block.data?.translations?.ru || 
                         block.data?.translations?.en || 
                         'Без заголовка';
        return titleText.length > 50 ? titleText.substring(0, 50) + '...' : titleText;
      
      case 'line':
        return `Линия (${block.data?.settings?.height || '1px'})`;
      
      case 'contact-info':
        const itemCount = block.items?.length || 0;
        const title = block.data?.title?.kz || 
                     block.data?.title?.ru || 
                     block.data?.title?.en || 
                     'Контактная информация';
        return `${title} (${itemCount} элементов)`;
      
      default:
        return config?.name || block.type;
    }
  };

  // Компактный предпросмотр для отображения в списке
  const getCompactPreview = () => {
    switch (block.type) {
      case 'title':
        const titleText = block.data?.translations?.kz || 
                         block.data?.translations?.ru || 
                         block.data?.translations?.en || 
                         '';
        return titleText ? (
          <div className="text-sm text-gray-600 truncate">
            "{titleText}"
          </div>
        ) : null;
      
      case 'line':
        return (
          <div className="h-1 bg-gray-300 rounded-full w-full"></div>
        );
      
      case 'contact-info':
        const itemCount = block.items?.length || 0;
        return itemCount > 0 ? (
          <div className="text-xs text-gray-500">
            {itemCount} контактных элементов
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all ${
        isDragging ? 'z-50 shadow-lg' : ''
      } ${
        isReorderLoading ? 'pointer-events-none opacity-75' : ''
      }`}
    >
      {/* Компактный заголовок блока */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center flex-1 min-w-0">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="mr-3 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
            title="Перетащите для изменения порядка"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
          </div>

          {/* Иконка и информация о блоке */}
          <span className="text-lg mr-3 text-gray-500">
            {config?.icon || '❓'}
          </span>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800 truncate">
                {getBlockSummary()}
              </h3>
              <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {index + 1}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {config?.name || block.type}
            </p>
            {/* Компактный предпросмотр */}
            {getCompactPreview()}
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex items-center space-x-1 ml-4">
          {/* Стрелки для изменения порядка */}
          <div className="flex flex-col">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0 || isReorderLoading}
              className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Переместить вверх"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4.5a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0V9h-3a.5.5 0 0 1 0-1h3V5a.5.5 0 0 1 .5-.5z" transform="rotate(-90 8 8)"/>
              </svg>
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalBlocks - 1 || isReorderLoading}
              className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Переместить вниз"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4.5a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0V9h-3a.5.5 0 0 1 0-1h3V5a.5.5 0 0 1 .5-.5z" transform="rotate(90 8 8)"/>
              </svg>
            </button>
          </div>

          {/* Кнопка предпросмотра */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Предпросмотр"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Основные кнопки */}
          <button
            onClick={() => onEdit(block)}
            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-sm font-medium transition-colors"
            disabled={isReorderLoading}
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(block.id)}
            className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-sm font-medium transition-colors"
            disabled={isReorderLoading}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Сворачиваемый предпросмотр */}
      {showPreview && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
            Предпросмотр
          </div>
          <div className="bg-white rounded border p-3">
            <BlockPreview block={block} />
          </div>
        </div>
      )}

      {/* Индикатор перетаскивания */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-blue-300 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-blue-600 font-medium text-sm">
            Перетаскивание...
          </div>
        </div>
      )}
    </div>
  );
};

export default SortableBlockItem;