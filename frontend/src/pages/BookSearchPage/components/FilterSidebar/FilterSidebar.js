import React, { useState } from 'react';
import './FilterSidebar.scss';

export default function FilterSidebar({ onFilterChange, activeFilters = {} }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const searchFields = [
    { value: 'all', label: 'Барлық жолдар' },
    { value: 'keywords', label: 'Кілт сөздер' },
    { value: 'author', label: 'Автор' },
    { value: 'title', label: 'Атауы' },
    { value: 'source_title', label: 'Дерекнама атауы' },
    { value: 'place_publication', label: 'Басылымның шыққан жері' },
    { value: 'publishing', label: 'Баспа' },
    { value: 'yearPublic', label: 'Басылымның шыққан жылы' },
    { value: 'personnel', label: 'Тұлғалар' },
    { value: 'geographic_name', label: 'Географиялық атауы' },
    { value: 'series', label: 'Сериясы' },
    { value: 'subject', label: 'Тақырыптама' },
    { value: 'udc', label: 'UDC index' },
    { value: 'isbn_issn', label: 'ISBN/ISSN' },
    { value: 'note', label: 'Ескерім' }
  ];

  const operators = [
    { value: 'AND', label: 'ЖӘНЕ' },
    { value: 'OR', label: 'НЕМЕСЕ' },
    { value: 'NOT', label: 'ЖОҚ' }
  ];

  const languages = [
    { value: 'kaz', label: 'Қазақша' },
    { value: 'rus', label: 'Орысша' },
    { value: 'eng', label: 'Ағылшын' }
  ];

  const [searchItems, setSearchItems] = useState([
    { field: 'all', operator: 'AND', value: '' }
  ]);

  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('kaz');

  const addSearchItem = () => {
    setSearchItems([...searchItems, { field: 'all', operator: 'AND', value: '' }]);
  };

  const removeSearchItem = (index) => {
    if (searchItems.length > 1) {
      const newItems = searchItems.filter((_, i) => i !== index);
      setSearchItems(newItems);
    }
  };

  const updateSearchItem = (index, field, value) => {
    const newItems = [...searchItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSearchItems(newItems);
  };

  const handleSearch = () => {
    const searchData = {
      searchType: 'ADVANCED',
      searchItems: searchItems.filter(item => item.value.trim()),
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
      language: selectedLanguage
    };
    onFilterChange(searchData);
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h3 className="filter-sidebar__title">Кеңейтілген іздеу</h3>
        <button 
          className="filter-sidebar__toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Жию' : 'Ашу'}
        </button>
      </div>

      <div className={`filter-sidebar__content ${isExpanded ? 'filter-sidebar__content--expanded' : ''}`}>
        {/* Поисковые поля */}
        <div className="filter-sidebar__section">
          <h4 className="filter-sidebar__section-title">Іздеу өрістері</h4>
          
          {searchItems.map((item, index) => (
            <div key={index} className="filter-sidebar__search-item">
              <div className="filter-sidebar__search-row">
                <select
                  value={item.field}
                  onChange={(e) => updateSearchItem(index, 'field', e.target.value)}
                  className="filter-sidebar__select"
                >
                  {searchFields.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>

                <select
                  value={item.operator}
                  onChange={(e) => updateSearchItem(index, 'operator', e.target.value)}
                  className="filter-sidebar__select filter-sidebar__select--operator"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>

                {index > 0 && (
                  <button
                    onClick={() => removeSearchItem(index)}
                    className="filter-sidebar__remove-btn"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>

              <input
                type="text"
                value={item.value}
                onChange={(e) => updateSearchItem(index, 'value', e.target.value)}
                placeholder="Іздеу сөзін енгізіңіз..."
                className="filter-sidebar__input"
              />
            </div>
          ))}

          <button
            onClick={addSearchItem}
            className="filter-sidebar__add-btn"
            type="button"
          >
            + Жаңа өріс қосу
          </button>
        </div>

        {/* Годы публикации */}
        <div className="filter-sidebar__section">
          <h4 className="filter-sidebar__section-title">Басылым жылы</h4>
          <div className="filter-sidebar__year-range">
            <div className="filter-sidebar__year-input">
              <label>Жылдан:</label>
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="1900"
                className="filter-sidebar__input"
              />
            </div>
            <div className="filter-sidebar__year-input">
              <label>Дейін жылы:</label>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="2024"
                className="filter-sidebar__input"
              />
            </div>
          </div>
        </div>

        {/* Язык */}
        <div className="filter-sidebar__section">
          <h4 className="filter-sidebar__section-title">Тіл</h4>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="filter-sidebar__select"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка поиска */}
        <button
          onClick={handleSearch}
          className="filter-sidebar__search-btn"
          type="button"
        >
          Іздеу
        </button>
      </div>
    </div>
  );
}
