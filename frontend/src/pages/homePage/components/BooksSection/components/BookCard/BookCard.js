import React from "react";
import { Eye } from "lucide-react";
import "./BookCard.scss";

const BookCard = ({ book, index, showReadCount = false }) => {
  const handleCardClick = () => {
    console.log("Clicked on book:", book.title);
  };

  const formatReadCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="universal-book-card" onClick={handleCardClick}>
      <div className="universal-book-card__image-container">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="universal-book-card__image"
          />
        ) : (
          <div
            className={`universal-book-card__image-book universal-book-card__image-book--${
              (index % 6) + 1
            }`}
          ></div>
        )}

        {showReadCount && book.readCount && (
          <div className="universal-book-card__read-badge">
            <Eye className="universal-book-card__eye-icon" />
            <span>{formatReadCount(book.readCount)}</span>
          </div>
        )}
      </div>

      <div className="universal-book-card__content">
        <h3 className="universal-book-card__title">{book.title}</h3>
        <p className="universal-book-card__author">{book.author}</p>
      </div>
    </div>
  );
};

export default BookCard;