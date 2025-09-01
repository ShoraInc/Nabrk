// components/blocks/BlockRenderer.js

import React from 'react';
import TitleBlock from './TitleBlock';
import LineBlock from './LineBlock';
import ContactInfoBlock from './ContactInfoBlock';
import FaqBlock from './FaqBlock';
import TextImageBlock from './TextImageBlock';
import ButtonBlock from './ButtonBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

const BlockRenderer = ({ block, currentLanguage = 'kz', isMobile = false }) => {
  const renderBlock = () => {
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
          <LineBlock 
            block={block}
            isMobile={isMobile}
          />
        );
      
      case 'contact-info':
        return (
          <ContactInfoBlock 
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        );
      
      case 'faq':
        return (
          <FaqBlock 
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        );
      
      case 'text-image':
        return (
          <TextImageBlock 
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        );
      
      case 'button':
        return (
          <ButtonBlock 
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        );
      
      case 'text':
        return (
          <TextBlock 
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        );
      
      case 'image':
        return (
          <ImageBlock 
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        );
      
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return (
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '6px',
            margin: '8px 0',
            color: '#856404',
            fontSize: '14px'
          }}>
            ⚠️ Неизвестный тип блока: {block.type}
          </div>
        );
    }
  };

  if (!block || !block.type) {
    console.error('Invalid block data:', block);
    return null;
  }

  return (
    <div 
      key={block.id}
      data-block-id={block.id}
      data-block-type={block.type}
      data-block-order={block.order}
      style={{
        width: "100%"
      }}
    >
      {renderBlock()}
    </div>
  );
};

export default BlockRenderer;