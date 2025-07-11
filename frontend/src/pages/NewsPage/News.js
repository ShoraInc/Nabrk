import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./News.scss";
import NewsApi from "../../api/newsApi";
import { generateRoute } from "../../routes/constants";

export default function News() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 12;

  useEffect(() => {
    // Получаем страницу из URL параметров
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page);
    loadNews(page);
  }, [searchParams]);

  const loadNews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await NewsApi.getAllNews({
        lang: 'kz',
        page: page,
        limit: itemsPerPage
      });
      
      if (response.news) {
        setNewsData(response.news);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalItems || 0);
      } else {
        setNewsData([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error('Failed to load news:', err);
      setError(err.message);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setSearchParams({ page: newPage.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNewsClick = (newsId) => {
    navigate(generateRoute.newsDetail(newsId));
  };

  const formatDate = (dateString) => {
    return NewsApi.formatDate(dateString);
  };

  // Компонент карточки новости
  const NewsCard = ({ news }) => (
    <div className="news-card" onClick={() => handleNewsClick(news.id)}>
      <div className="news-card-image-container">
        {news.imageUrl ? (
          <img 
            src={news.imageUrl} 
            alt={news.title}
            className="news-card-image"
          />
        ) : (
          <div className="news-card-placeholder">
            <span>📰</span>
          </div>
        )}
      </div>
      <div className="news-card-content">
        <h3 className="news-card-title">{news.title}</h3>
        {news.shortDescription && (
          <p className="news-card-description">{news.shortDescription}</p>
        )}
        <div className="news-card-meta">
          <span className="news-card-date">{formatDate(news.publishedDate)}</span>
          <div className="news-card-views">
            <span className="views-icon">👁</span>
            <span className="views-count">{news.views}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Компонент пагинации
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="pagination">
        <button 
          className="pagination-btn prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ Алдыңғы
        </button>
        
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={index} className="pagination-dots">...</span>
            ) : (
              <button
                key={index}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button 
          className="pagination-btn next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Келесі ›
        </button>
      </div>
    );
  };

  // Компонент загрузки
  const LoadingState = () => (
    <div className="news-grid">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="news-card loading">
          <div className="skeleton-image"></div>
          <div className="news-card-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-meta"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Компонент пустого состояния
  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-state-icon">📰</div>
      <h2>Жаңалықтар табылмады</h2>
      <p>Әзірше жарияланған жаңалықтар жоқ</p>
    </div>
  );

  // Компонент ошибки
  const ErrorState = () => (
    <div className="error-state">
      <div className="error-state-icon">⚠️</div>
      <h2>Қате орын алды</h2>
      <p>Жаңалықтарды жүктеу мүмкін болмады</p>
      <button onClick={() => loadNews(currentPage)} className="retry-btn">
        Қайта жүктеу
      </button>
    </div>
  );

  return (
    <div className="news-page">
      <div className="news-page-container">
        <div className="news-page-header">
          <h1 className="news-page-title">Барлық жаңалықтар</h1>
          {!loading && !error && totalItems > 0 && (
            <div className="news-page-info">
              <span>{totalItems} жаңалық табылды</span>
            </div>
          )}
        </div>

        {loading && <LoadingState />}
        
        {error && !loading && <ErrorState />}
        
        {!loading && !error && newsData.length === 0 && <EmptyState />}
        
        {!loading && !error && newsData.length > 0 && (
          <>
            <div className="news-grid">
              {newsData.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
            
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
}