// components/admin/blocks/BlockPreview.js
import React from 'react';
import { BLOCK_TYPES_CONFIG } from '../../../config/blockTypesConfig';
import { useLanguage } from '../../../context/LanguageContext';
import useMobileDetection from '../../../hooks/useMobileDetection';
import TitleBlock from './admin/AdminTitleBlock';
import AdminLineBlock from './admin/AdminLineBlock';
import AdminContactInfoBlock from './admin/AdminContactInfoBlock';
import AdminFaqBlock from './admin/AdminFaqBlock';

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
      
      case 'faq':
        return (
          <AdminFaqBlock
            block={block}
            currentLanguage={currentLanguage}
          />
        );
      
      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <span className="text-yellow-800 text-sm">
                Предпросмотр для типа блока "{block.type}" не реализован
              </span>
            </div>
          </div>
        );
    }
  };

  const config = BLOCK_TYPES_CONFIG[block.type];

  // Получаем краткую информацию о переводах
  const getTranslationsInfo = () => {
    if (!config?.hasTranslations) return null;
    
    switch (block.type) {
      case 'title': {
        const titleLangs = Object.keys(block.data?.translations || {});
        return titleLangs.length > 0 ? titleLangs.join(', ') : null;
      }
      
      case 'contact-info': {
        const titleLangs = block.data?.title ? 
          Object.keys(block.data.title).filter(lang => block.data.title[lang]) : [];
        const itemsLangs = block.items ? 
          new Set(block.items.flatMap(item => 
            Object.keys(item.data?.texts || {}).filter(lang => item.data.texts[lang])
          )) : new Set();
        
        const allLangs = new Set([...titleLangs, ...itemsLangs]);
        return allLangs.size > 0 ? Array.from(allLangs).join(', ') : null;
      }
      
      case 'faq': {
        const questionLangs = Object.keys(block.data?.translations || {});
        return questionLangs.length > 0 ? questionLangs.join(', ') : null;
      }
      
      default:
        return null;
    }
  };

  // Получаем количество элементов для contact-info
  const getItemsCount = () => {
    if (block.type === 'contact-info') {
      return block.items?.length || 0;
    }
    return null;
  };

  const translationsInfo = getTranslationsInfo();
  const itemsCount = getItemsCount();

  return (
    <div className="space-y-3">
      {/* Компактная информация о блоке */}
      {(translationsInfo || itemsCount !== null) && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          {translationsInfo && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              🌐 {translationsInfo}
            </span>
          )}
          {itemsCount !== null && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              📞 {itemsCount} элементов
            </span>
          )}
        </div>
      )}

      {/* Компактный предпросмотр */}
      <div className="border border-gray-200 rounded p-3 bg-white">
        <div className="min-h-[30px]">
          {renderBlockPreview()}
        </div>
      </div>
    </div>
  );
};

export default BlockPreview;