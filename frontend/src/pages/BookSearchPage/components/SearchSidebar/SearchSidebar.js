import React, { useState } from 'react';
import './SearchSidebar.scss';

const SearchSidebar = ({ filters, onFilterChange, refinementItems }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['country_edition', 'language']));

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleFilterChange = (filterType, value, checked) => {
    onFilterChange(filterType, value, checked);
  };

  const getFilterDisplayName = (filterType) => {
    const displayNames = {
      'country_edition': 'Мемлекет',
      'language': 'Тілі',
      'publication_type': 'Жанр',
      'topic': 'Тақырып',
      'sphere': 'Аймақ',
      'publishing': 'Баспа',
      'place_publication': 'Жариялау орни',
      'series': 'Сериялар',
      'geographic_name': 'Географиялық атау'
    };
    return displayNames[filterType] || filterType;
  };

  const getCountryName = (countryCode) => {
    const countryNames = {
      'KZ': 'Қазақстан',
      'RU': 'Ресей Федерациясы', 
      'KG': 'Қырғызстан',
      'US': 'АҚШ',
      'FR': 'Франция',
      'TR': 'Түркия',
      'DE': 'Германия',
      'CO': 'Колумбия',
      'UK': 'Ұлыбритания',
      'IL': 'Израиль',
      'AT': 'Австрия',
      'CH': 'Швейцария'
    };
    return countryNames[countryCode] || countryCode;
  };

  const getLanguageName = (langCode) => {
    const languageNames = {
      'kaz': 'Қазақша',
      'rus': 'Орысша',
      'eng': 'Ағылшынша',
      'fra': 'Французша',
      'ger': 'Немісше'
    };
    return languageNames[langCode] || langCode;
  };

  if (!refinementItems) {
    return null;
  }

  return (
    <div className="search-sidebar">
      <div className="search-sidebar__header">
        <h3>Нәтижелерді сүзу</h3>
        {Object.keys(filters).length > 0 && (
          <div className="search-sidebar__applied-filters">
            <small>Қолданылған сүзгілер: {Object.keys(filters).length}</small>
          </div>
        )}
      </div>

      {Object.entries(refinementItems).map(([filterType, items]) => {
        if (!items || items.length === 0) return null;
        
        const isExpanded = expandedSections.has(filterType);
        const displayName = getFilterDisplayName(filterType);

        return (
          <div key={filterType} className="search-sidebar__section">
            <div 
              className="search-sidebar__section-header"
              onClick={() => toggleSection(filterType)}
            >
              <span className="search-sidebar__section-title">{displayName}</span>
              <button className={`search-sidebar__chevron ${isExpanded ? 'search-sidebar__chevron--expanded' : ''}`}>
                ▲
              </button>
            </div>

            {isExpanded && (
              <div className="search-sidebar__section-content">
                {items.slice(0, 10).map((item) => (
                  <label key={item.value} className="search-sidebar__filter-item">
                    <input
                      type="checkbox"
                      checked={filters[filterType]?.includes(item.value) || false}
                      onChange={(e) => handleFilterChange(filterType, item.value, e.target.checked)}
                      className="search-sidebar__checkbox"
                    />
                    <span className="search-sidebar__filter-label">
                      {filterType === 'country_edition' 
                        ? getCountryName(item.name || item.value) 
                        : filterType === 'language'
                        ? getLanguageName(item.name || item.value)
                        : item.name || item.value}
                    </span>
                    <span className="search-sidebar__filter-count">{item.count}</span>
                  </label>
                ))}
                
                {items.length > 10 && (
                  <button className="search-sidebar__show-more">
                    Көбірек көрсету ({items.length - 10})
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SearchSidebar;
