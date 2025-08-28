import React, { useState } from 'react';
import './AdvancedSearchForm.scss';

export default function AdvancedSearchForm({ onSearch, loading }) {
  const searchFields = [
    { value: 'all', label: 'Барлық жолдар' },
    { value: 'keywords', label: 'Кілт сөздер' },
    { value: 'author', label: 'Автор' },
    { value: 'title', label: 'Атауы' },
    { value: 'source_title', label: 'Дерекнама атауы' },
    { value: 'place_publication', label: 'Басылымның шыққан жері' },
    { value: 'publishing', label: 'Баспа' },
    { value: 'year_publication', label: 'Басылымның шыққан жылы' },
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

  const [searchItems, setSearchItems] = useState([
    { field: 'all', operator: 'AND', value: '' }
  ]);

  const [yearFrom, setYearFrom] = useState('1800');
  const [yearTo, setYearTo] = useState('2025');
  const [selectedLanguage, setSelectedLanguage] = useState('000'); // "000" = все языки, как в Java
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedResults, setSelectedResults] = useState('10');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверяем, есть ли хотя бы одно поле с данными
    const validSearchItems = searchItems.filter(item => item.value && item.value.trim());
    if (validSearchItems.length === 0) {
      alert('Кемінде бір іздеу өрісін толтырыңыз');
      return;
    }
    
    const searchData = {
      searchType: 'ADVANCED',
      searchItems: validSearchItems,
      fromYear: yearFrom ? parseInt(yearFrom) : undefined,
      toYear: yearTo ? parseInt(yearTo) : undefined,
      language: selectedLanguage === '000' ? undefined : selectedLanguage, // Не отправляем "000"
      limit: parseInt(selectedResults)
    };
    onSearch(searchData);
  };

  return (
    <div className="advanced-search-form">
      <form onSubmit={handleSubmit} className="advanced-search-form__form">
        {/* Поисковые поля */}
        <div className="advanced-search-form__section">
          <h3 className="advanced-search-form__section-title">
            Аты бойынша іздеу, категория бойынша іздеу
          </h3>
          
          {searchItems.map((item, index) => (
            <div key={index} className="advanced-search-form__search-item">
              <div className="advanced-search-form__search-row">
                <select
                  value={item.field}
                  onChange={(e) => updateSearchItem(index, 'field', e.target.value)}
                  className="advanced-search-form__select"
                  disabled={loading}
                >
                  {searchFields.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateSearchItem(index, 'value', e.target.value)}
                  placeholder="Аты бойынша іздеу, категория бойынша іздеу"
                  className="advanced-search-form__input"
                  disabled={loading}
                />
              </div>

              {/* Логические операторы */}
              <div className="advanced-search-form__operators">
                {operators.map(op => (
                  <label key={op.value} className="advanced-search-form__operator">
                    <input
                      type="radio"
                      name={`operator-${index}`}
                      value={op.value}
                      checked={item.operator === op.value}
                      onChange={(e) => updateSearchItem(index, 'operator', e.target.value)}
                      disabled={loading}
                    />
                    <span>{op.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Кнопки управления строками */}
          <div className="advanced-search-form__row-controls">
            <button
              type="button"
              onClick={addSearchItem}
              className="advanced-search-form__add-row-btn"
              disabled={loading}
            >
              Бір жолды қосу
            </button>
            <button
              type="button"
              onClick={() => removeSearchItem(searchItems.length - 1)}
              className="advanced-search-form__remove-row-btn"
              disabled={loading || searchItems.length <= 1}
            >
              Соңғы жолды жою
            </button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="advanced-search-form__section">
          <div className="advanced-search-form__filters">
            {/* Годы */}
            <div className="advanced-search-form__filter-group">
              <label className="advanced-search-form__filter-label">Жылдан:</label>
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className="advanced-search-form__filter-input"
                disabled={loading}
              />
            </div>
            
            <div className="advanced-search-form__filter-group">
              <label className="advanced-search-form__filter-label">Дейін:</label>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className="advanced-search-form__filter-input"
                disabled={loading}
              />
            </div>

            {/* Язык */}
            <div className="advanced-search-form__filter-group">
              <label className="advanced-search-form__filter-label">тілдік құжат</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="advanced-search-form__filter-select"
                disabled={loading}
              >
                <option value="000">Барлық</option>
                <option value="kaz">Қазақша</option>
                <option value="rus">Орысша</option>
                <option value="eng">Ағылшын</option>
              </select>
            </div>

            {/* Формат */}
            <div className="advanced-search-form__filter-group">
              <label className="advanced-search-form__filter-label">Форматты қарау</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="advanced-search-form__filter-select"
                disabled={loading}
              >
                <option value="all">Барлық</option>
                <option value="book">Кітап</option>
                <option value="article">Мақала</option>
                <option value="journal">Журнал</option>
              </select>
            </div>

            {/* Результаты */}
            <div className="advanced-search-form__filter-group">
              <label className="advanced-search-form__filter-label">Нәтижелер</label>
              <select
                value={selectedResults}
                onChange={(e) => setSelectedResults(e.target.value)}
                className="advanced-search-form__filter-select"
                disabled={loading}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Кнопка поиска */}
        <div className="advanced-search-form__submit-section">
          <button
            type="submit"
            disabled={loading}
            className="advanced-search-form__submit-btn"
          >
            {loading ? 'Іздеу...' : 'Іздеу'}
          </button>
        </div>
      </form>
    </div>
  );
}
