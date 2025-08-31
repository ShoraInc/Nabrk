import React, { useState } from 'react';
import udcData from './udcClassification.json';
import './UdcHierarchy.scss';

const UdcHierarchy = ({ onSelectUdc, selectedUdc }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (code) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedCategories(newExpanded);
  };

  const handleUdcSelect = (code) => {
    onSelectUdc(code);
  };

  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedCategories.has(category.code);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isSelected = selectedUdc === category.code;

    return (
      <div key={category.code} className={`udc-hierarchy__item udc-hierarchy__item--level-${level}`}>
        <div 
          className={`udc-hierarchy__header ${isSelected ? 'udc-hierarchy__header--selected' : ''}`}
          onClick={() => handleUdcSelect(category.code)}
        >
          {hasSubcategories && (
            <button
              className={`udc-hierarchy__chevron ${isExpanded ? 'udc-hierarchy__chevron--expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.code);
              }}
            >
              ▼
            </button>
          )}
          <span className="udc-hierarchy__code">{category.code}</span>
          <span className="udc-hierarchy__title">{category.title}</span>
        </div>
        
        {hasSubcategories && isExpanded && (
          <div className="udc-hierarchy__subcategories">
            {category.subcategories.map(subcategory => renderCategory(subcategory, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="udc-hierarchy">
      <div className="udc-hierarchy__controls">
        <button 
          className="udc-hierarchy__control-btn"
          onClick={() => setExpandedCategories(new Set())}
        >
          Жиыру
        </button>
        <button 
          className="udc-hierarchy__control-btn"
          onClick={() => {
            const allCodes = new Set();
            const collectCodes = (categories) => {
              categories.forEach(cat => {
                allCodes.add(cat.code);
                if (cat.subcategories) {
                  collectCodes(cat.subcategories);
                }
              });
            };
            collectCodes(udcData.udcCategories);
            setExpandedCategories(allCodes);
          }}
        >
          Жазу
        </button>
      </div>
      
      <div className="udc-hierarchy__list">
        {udcData.udcCategories.map(category => renderCategory(category))}
      </div>
    </div>
  );
};

export default UdcHierarchy;
