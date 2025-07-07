import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./NewsDetail.scss";
import NewsApi from "../../api/newsApi";

export default function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNewsDetail();
  }, [id]);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await NewsApi.getNewsById(id, 'kz');
      setNewsItem(response);
    } catch (err) {
      console.error('Failed to load news detail:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const LoadingState = () => (
    <div className="news-detail">
      <div className="news-detail-container">
        {/* Loading skeleton */}
        <div className="news-detail-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta"></div>
        </div>
        <div className="skeleton-image"></div>
        <div className="news-detail-content">
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="news-detail">
      <div className="news-detail-container">
        <div className="error-state">
          <h1>Жаңалық табылмады</h1>
          <p>Сұралған жаңалық жоқ немесе жүйеде қате орын алды.</p>
          <button onClick={() => window.history.back()}>Артқа қайту</button>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error || !newsItem) return <ErrorState />;

  return (
    <div className="news-detail">
      <div className="news-detail-container">
        <div className="news-detail-header">
          <h1 className="news-detail-title">{newsItem.title}</h1>
          <div className="news-detail-meta">
            <span className="news-detail-date">{NewsApi.formatDate(newsItem.publishedDate)}</span>
            <div className="news-detail-views">
              <span className="views-icon">👁</span>
              <span className="views-count">{newsItem.views}</span>
            </div>
          </div>
        </div>
        
        {newsItem.imageUrl && (
          <div className="news-detail-image-container">
            <img 
              src={newsItem.imageUrl} 
              alt={newsItem.title}
              className="news-detail-image"
            />
          </div>
        )}
        
        <div className="news-detail-content">
          <div 
            className="news-detail-text"
            dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br>') }}
          />
        </div>
      </div>
    </div>
  );
}