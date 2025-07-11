// components/admin/blocks/SortableBlockItem.js
import React from 'react';
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow ${isDragging ? 'z-50' : ''} ${
        isReorderLoading ? 'pointer-events-none opacity-75' : ''
      }`}
    >
      {/* Заголовок блока */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="mr-3 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
            title="Перетащите для изменения порядка"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
          </div>

          {/* Иконка и информация о блоке */}
          <span className="text-2xl mr-3">
            {BLOCK_TYPES_CONFIG[block.type]?.icon || '❓'}
          </span>
          <div>
            <h3 className="font-semibold text-gray-800">
              {BLOCK_TYPES_CONFIG[block.type]?.name || block.type}
            </h3>
            <p className="text-sm text-gray-500">
              Позиция: {index + 1} | Порядок: {block.order} | ID: {block.id}
            </p>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex items-center space-x-2">
          {/* Стрелки для изменения порядка */}
          <div className="flex flex-col">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0 || isReorderLoading}
              className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Переместить вверх"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4.5a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0V9h-3a.5.5 0 0 1 0-1h3V5a.5.5 0 0 1 .5-.5z" transform="rotate(-90 8 8)"/>
              </svg>
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalBlocks - 1 || isReorderLoading}
              className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Переместить вниз"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4.5a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0V9h-3a.5.5 0 0 1 0-1h3V5a.5.5 0 0 1 .5-.5z" transform="rotate(90 8 8)"/>
              </svg>
            </button>
          </div>

          {/* Основные кнопки */}
          <button
            onClick={() => onEdit(block)}
            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded text-sm font-medium transition-colors"
            disabled={isReorderLoading}
          >
            Редактировать
          </button>
          <button
            onClick={() => onDelete(block.id)}
            className="text-red-600 hover:text-red-900 px-3 py-1 rounded text-sm font-medium transition-colors"
            disabled={isReorderLoading}
          >
            Удалить
          </button>
        </div>
      </div>

      {/* Предпросмотр блока */}
      <div className="p-6">
        <BlockPreview block={block} />
      </div>

      {/* Индикатор перетаскивания */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-blue-300 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-blue-600 font-medium">
            Перетаскивание...
          </div>
        </div>
      )}
    </div>
  );
};

export default SortableBlockItem;