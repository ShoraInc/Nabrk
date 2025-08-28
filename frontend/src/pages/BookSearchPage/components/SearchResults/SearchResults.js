import React from 'react';
import './SearchResults.scss';
import BookCard from '../BookCard/BookCard';

export default function SearchResults({ results, loading, searchStats }) {
  if (loading) {
    return (
      <div className="search-results">
        <div className="search-results__loading">
          <div className="search-results__spinner"></div>
          <span className="search-results__loading-text">Іздеу...</span>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results__empty">
          <p className="search-results__empty-title">Нәтиже табылмады</p>
          <p className="search-results__empty-subtitle">
            Басқа іздеу сөздерін қолданып көріңіз
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      {/* Статистика поиска */}
      {searchStats && searchStats.totalResults > 0 && (
        <div className="search-results__stats">
          <p className="search-results__stats-text">
            Табылды: <strong>{searchStats.totalResults}</strong> нәтиже
            {searchStats.searchTime && (
              <span className="search-results__stats-time">
                ({Math.round((Date.now() - searchStats.searchTime) / 1000)}с)
              </span>
            )}
          </p>
        </div>
      )}
      
      <div className="search-results__list">
        {results.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
