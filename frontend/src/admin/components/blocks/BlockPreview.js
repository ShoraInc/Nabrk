// components/admin/blocks/BlockPreview.js
import React from 'react';
import { BLOCK_TYPES_CONFIG } from '../../../config/blockTypesConfig';
import { useLanguage } from '../../../context/LanguageContext';
import useMobileDetection from '../../../hooks/useMobileDetection';
import TitleBlock from './admin/AdminTitleBlock';
import AdminLineBlock from './admin/AdminLineBlock';
import AdminContactInfoBlock from './admin/AdminContactInfoBlock';

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
      
      case 'contact-info':
        return (
          <AdminContactInfoBlock
            block={block}
            currentLanguage={currentLanguage}
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

  const getTranslationsInfo = () => {
    if (!config?.hasTranslations) return 'Нет';
    
    switch (block.type) {
      case 'title':
        return Object.keys(block.data?.translations || {}).join(', ') || 'Нет';
      
      case 'contact-info':
        const titleLangs = block.data?.title ? 
          Object.keys(block.data.title).filter(lang => block.data.title[lang]) : [];
        const itemsLangs = block.items ? 
          new Set(block.items.flatMap(item => 
            Object.keys(item.data?.texts || {}).filter(lang => item.data.texts[lang])
          )) : new Set();
        
        const allLangs = new Set([...titleLangs, ...itemsLangs]);
        return allLangs.size > 0 ? Array.from(allLangs).join(', ') : 'Нет';
      
      default:
        return 'Нет';
    }
  };

  const getItemsCount = () => {
    if (block.type === 'contact-info') {
      return block.items?.length || 0;
    }
    return null;
  };

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
            <strong>Переводы:</strong> {getTranslationsInfo()}
          </div>
        )}
        {getItemsCount() !== null && (
          <div>
            <strong>Элементов:</strong> {getItemsCount()}
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

      {/* Специфичная информация по типам блоков */}
      {block.type === 'contact-info' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm">
            <div className="font-medium text-blue-800 mb-2">
              📞 Информация о контактном блоке
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-700">
              <div>
                <strong>Заголовок:</strong> {
                  block.data?.title?.[currentLanguage] || 
                  block.data?.title?.ru || 
                  'Не задан'
                }
              </div>
              <div>
                <strong>Показывать заголовок:</strong> {
                  block.data?.settings?.showTitle ? 'Да' : 'Нет'
                }
              </div>
              <div>
                <strong>Расстояние между элементами:</strong> {
                  block.data?.settings?.itemSpacing || 'normal'
                }
              </div>
              <div>
                <strong>Размер иконок:</strong> {
                  block.data?.settings?.iconSize || 'medium'
                }
              </div>
            </div>
            {block.items && block.items.length > 0 && (
              <div className="mt-2">
                <strong>Типы элементов:</strong> {
                  [...new Set(block.items.map(item => item.type))].join(', ')
                }
              </div>
            )}
          </div>
        </div>
      )}

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