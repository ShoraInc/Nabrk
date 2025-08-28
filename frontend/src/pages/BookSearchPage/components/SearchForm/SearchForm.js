import React, { useState } from 'react';
import './SearchForm.scss';

export default function SearchForm({ onSearch, loading, searchType = 'SIMPLE' }) {
  const [selectedField, setSelectedField] = useState('all');
  const [searchText, setSearchText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchText.trim()) return;
    
    let searchData;
    
    if (searchType === 'FULLTEXT') {
      searchData = {
        searchType: 'FULLTEXT',
        fullTextSearchText: searchText,
        limit: 10
      };
         } else if (searchType === 'UDC') {
       searchData = {
         searchType: 'UDC',
         searchItems: [{
           field: 'topic',
           operator: 'AND',
           value: searchText
         }],
         limit: 10
       };
    } else {
      // SIMPLE search
      searchData = {
        searchType: 'SIMPLE',
        searchItems: [{
          field: selectedField,
          operator: 'AND',
          value: searchText
        }],
        limit: 10
      };
    }
    
    onSearch(searchData);
  };

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

  const getPlaceholder = () => {
    if (searchType === 'FULLTEXT') {
      return "Іздеу үшін автордың атын немесе мәтіннен үзіндіні енгізіңіз";
    } else if (searchType === 'UDC') {
      return "ӘОЖ индексін енгізіңіз";
    } else {
      return "Аты бойынша іздеу, категория бойынша іздеу";
    }
  };

  // Если это UDC поиск, показываем специальный интерфейс
  if (searchType === 'UDC') {
    return (
      <div className="search-form search-form--udc">
        <form onSubmit={handleSubmit} className="search-form__form">
          <div className="search-form__udc-container">
            <div className="search-form__udc-input-section">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={getPlaceholder()}
                className="search-form__udc-input"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !searchText.trim()}
                className="search-form__submit-btn"
              >
                {loading ? 'Іздеу...' : 'Іздеу'}
              </button>
            </div>
            
            <div className="search-form__udc-categories">
              <div className="search-form__udc-controls">
                <span>Жазу</span>
                <span>Жиыру</span>
              </div>
              
              <div className="search-form__udc-list">
                <div className="search-form__udc-item" onClick={() => setSearchText('0')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>0 - Наука и знание. Организация. Информатика. Информация. Документация. Библиотечное дело. Учреждения. Публикации в целом</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('1')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>1 - Философия. Психология</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('2')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>2 - Религия. Богословие</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('3')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>3 - Общественные науки. Статистика. Политика. Экономика. Торговля. Право. Государство. Военное дело. Социальное обеспечение. Страхование. Образование. Фольклор</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('5')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>5 - Математика и естественные науки</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('6')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>6 - Прикладные науки. Медицина. Технология</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('7')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>7 - Искусство. Развлечения. Зрелища. Спорт</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('8')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>8 - Язык. Языкознание. Лингвистика. Литература</span>
                </div>
                <div className="search-form__udc-item" onClick={() => setSearchText('9')}>
                  <span className="search-form__udc-chevron">▼</span>
                  <span>9 - География. Биографии. История</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`search-form ${searchType === 'FULLTEXT' ? 'search-form--fulltext' : ''}`}>
      <form onSubmit={handleSubmit} className="search-form__form">
        {/* Поле поиска с выпадающим списком */}
        <div className="search-form__search-bar">
          {searchType !== 'FULLTEXT' && (
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="search-form__field-select"
              disabled={loading}
            >
              {searchFields.map(field => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          )}
          
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={getPlaceholder()}
            className="search-form__input"
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || !searchText.trim()}
            className="search-form__submit-btn"
          >
            {loading ? 'Іздеу...' : 'Іздеу'}
          </button>
        </div>
      </form>
    </div>
  );
}
