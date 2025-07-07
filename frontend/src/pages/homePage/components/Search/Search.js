import React, { useState } from 'react';
import './Search.scss';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Э-каталог');

  const categories = [
    'Э-каталог',
    'Кітаптар', 
    'Авторлар',
    'Тақырыптар'
  ];

  return (
    <section className="search">
      <div className="search__container">
        <div className="search__form">
          
          <div className="search__filter">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 7H21L15 13V19L9 17V13L3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="search__input-wrapper">
            <input
              type="text"
              className="search__input"
              placeholder="Кітаптар, фотосуреттер, құжаттар үшін коллекциямыздан іздеңіз..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="search__dropdown">
            <select 
              className="search__select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <svg className="search__dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <button className="search__button" type="submit">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
};

export default Search;