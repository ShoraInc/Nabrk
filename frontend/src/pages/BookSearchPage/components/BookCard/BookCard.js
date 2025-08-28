import React from 'react';
import './BookCard.scss';

export default function BookCard({ book }) {
  const getStatusColor = () => {
    const isAvailable = Math.random() > 0.3;
    return isAvailable ? 'book-card__status--available' : 'book-card__status--busy';
  };

  const getStatusText = () => {
    const isAvailable = Math.random() > 0.3;
    return isAvailable ? 'Бос' : 'Занят';
  };

  return (
    <div className="book-card">
      <div className="book-card__content">
        {/* Основная информация */}
        <div className="book-card__main">
          <h3 className="book-card__title">
            {book.title}
          </h3>
          
          <p className="book-card__author">
            <span className="book-card__label">Автор:</span> {book.authors || book.author}
          </p>
          
          {book.source_title && (
            <p className="book-card__source-title">
              <span className="book-card__label">Дерекнама атауы:</span> {book.source_title}
            </p>
          )}
          
          <div className="book-card__details">
            {(book.yearPublic || book.year) && (
              <p className="book-card__detail">
                <span className="book-card__label">Жылы:</span> {book.yearPublic || book.year}
              </p>
            )}
            {book.publishing && (
              <p className="book-card__detail">
                <span className="book-card__label">Баспа:</span> {book.publishing}
              </p>
            )}
            {book.place_publication && (
              <p className="book-card__detail">
                <span className="book-card__label">Орын:</span> {book.place_publication}
              </p>
            )}
            {book.series && (
              <p className="book-card__detail">
                <span className="book-card__label">Серия:</span> {book.series}
              </p>
            )}
            {book.isbn_issn && (
              <p className="book-card__detail">
                <span className="book-card__label">ISBN/ISSN:</span> {book.isbn_issn}
              </p>
            )}
            {book.udc && (
              <p className="book-card__detail">
                <span className="book-card__label">ӘОЖ:</span> {book.udc}
              </p>
            )}
          </div>
          
          {book.note && (
            <p className="book-card__note">
              {book.note}
            </p>
          )}
        </div>

        {/* Боковая панель с действиями */}
        <div className="book-card__sidebar">
          {/* Статус */}
          <div className="book-card__status-wrapper">
            <span className={`book-card__status ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Действия */}
          <div className="book-card__actions">
            <button className="book-card__action-btn book-card__action-btn--primary">
              Оқырман залы
            </button>
            <button className="book-card__action-btn book-card__action-btn--secondary">
              Электронды көшірме
            </button>
            <button className="book-card__action-btn book-card__action-btn--secondary">
              Таңдалғандар
            </button>
          </div>

          {/* Дополнительная информация */}
          <div className="book-card__meta">
            <p className="book-card__meta-item">ID: {book.id}</p>
            <p className="book-card__meta-item">Тип: {book.publicationCodeName}</p>
            <p className="book-card__meta-item">
              Тіл: {book.language === 'rus' ? 'Русский' : book.language === 'kaz' ? 'Казахский' : book.language}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
