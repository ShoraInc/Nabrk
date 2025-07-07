import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "./components/BookCard/BookCard";
import "./BookSection.scss";

const BooksSection = ({
  title,
  books,
  showReadCount = false,
  className = "",
  sectionType = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleBooks, setVisibleBooks] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setVisibleBooks(2);
      } else if (width <= 768) {
        setVisibleBooks(3);
      } else if (width <= 1024) {
        setVisibleBooks(4);
      } else {
        setVisibleBooks(5);
      }
      // Reset to first slide when screen size changes
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate max index properly
  const maxIndex = Math.max(0, books.length - visibleBooks);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < maxIndex;

  const handlePrevious = () => {
    if (canScrollLeft && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleNext = () => {
    if (canScrollRight && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Calculate transform based on current index and slide width percentage
  const getTransform = () => {
    const slideWidthPercent = 100 / books.length;
    const offset = currentIndex * slideWidthPercent;
    return `translateX(-${offset}%)`;
  };

  return (
    <div className={`books-section ${className}`}>
      <div className="books-section__container">
        {/* Header */}
        <div className="books-section__header">
          <h1 className="books-section__title">{title}</h1>
          <div className="books-section__nav">
            <button
              className={`books-section__nav-btn ${
                !canScrollLeft ? "disabled" : ""
              }`}
              onClick={handlePrevious}
              disabled={!canScrollLeft || isTransitioning}
              aria-label="Previous books"
            >
              <ChevronLeft className="books-section__nav-icon" />
            </button>
            <button
              className={`books-section__nav-btn ${
                !canScrollRight ? "disabled" : ""
              }`}
              onClick={handleNext}
              disabled={!canScrollRight || isTransitioning}
              aria-label="Next books"
            >
              <ChevronRight className="books-section__nav-icon" />
            </button>
          </div>
        </div>

        {/* Books Carousel */}
        <div className="books-section__carousel" ref={containerRef}>
          <div className="books-section__track">
            <div
              className="books-section__slider"
              style={{
                transform: getTransform(),
                transition: isTransitioning
                  ? "transform 0.3s ease-in-out"
                  : "none",
                width: `${(books.length / visibleBooks) * 100}%`,
              }}
            >
              {books.map((book, index) => (
                <div
                  className="books-section__slide"
                  key={book.id}
                  style={{
                    flex: `0 0 ${100 / books.length}%`,
                  }}
                >
                  <BookCard
                    book={book}
                    index={index}
                    showReadCount={showReadCount}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksSection;
