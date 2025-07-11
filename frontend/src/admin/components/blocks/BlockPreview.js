// components/admin/blocks/BlockPreview.js
import React from 'react';
import { BLOCK_TYPES_CONFIG } from '../../../config/blockTypesConfig';
import { useLanguage } from '../../../context/LanguageContext';
import useMobileDetection from '../../../hooks/useMobileDetection';
import TitleBlock from './admin/AdminTitleBlock';
import AdminLineBlock from './admin/AdminLineBlock';

const BlockPreview = ({ block }) => {
  const { currentLanguage } = useLanguage();
  const isMobile = useMobileDetection();

  const renderBlockPreview = () => {
    switch (block.type) {
      case 'title':
        return (
          <TitleBlock
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        );
      
      case 'line':
        return (
          <AdminLineBlock
            block={block}
            isMobile={isMobile}
          />
        );
      
      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <span className="text-yellow-800">
                Предпросмотр для типа блока "{block.type}" не реализован
              </span>
            </div>
          </div>
        );
    }
  };

  const config = BLOCK_TYPES_CONFIG[block.type];

  return (
    <div className="space-y-4">
      {/* Информация о блоке */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <div>
          <strong>Тип:</strong> {config?.name || block.type}
        </div>
        <div>
          <strong>Порядок:</strong> {block.order}
        </div>
        {config?.hasTranslations && (
          <div>
            <strong>Переводы:</strong> {
              Object.keys(block.data?.translations || {}).join(', ') || 'Нет'
            }
          </div>
        )}
        <div>
          <strong>Создан:</strong> {new Date(block.createdAt).toLocaleDateString('ru-RU')}
        </div>
      </div>

      {/* Предпросмотр */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
          Предпросмотр (язык: {currentLanguage})
        </div>
        <div className="min-h-[40px]">
          {renderBlockPreview()}
        </div>
      </div>

      {/* Данные блока (для отладки) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            🔍 Данные блока (dev)
          </summary>
          <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(block, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default BlockPreview;