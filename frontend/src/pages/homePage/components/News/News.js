import React, { useState, useEffect } from "react";
import "./News.scss";
import ArrowIcon from "./assets/icons/Arrow-icon.png";
import NewsApi from "../../../../api/newsApi";
import { useNavigate } from "react-router-dom";
import { generateRoute } from "../../../../routes/constants";
import { useTranslations } from "../../../../hooks/useTranslations";

export default function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslations();

  useEffect(() => {
    loadNews();
  }, [currentLanguage]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await NewsApi.getPublishedNews({
        lang: currentLanguage,
        limit: 5,
      });

      if (response.news && response.news.length > 0) {
        // Форматируем данные для компонента
        const formattedNews = response.news.map((item, index) => ({
          id: item.id,
          title: item.title,
          date: NewsApi.formatDate(item.publishedDate),
          image: item.imageUrl || "/default-news-image.jpg", // fallback изображение
          externalUrl: item.externalUrl, // внешняя ссылка
          isLarge: index === 0, // первая новость будет большой
        }));

        setNewsData(formattedNews);
      } else {
        setNewsData([]);
      }
    } catch (err) {
      console.error("Failed to load news:", err);
      setError(err.message);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsClick = (news) => {
    // Если есть внешняя ссылка - переходим по ней, иначе на стандартную страницу
    if (news.externalUrl) {
      window.open(news.externalUrl, '_blank');
    } else {
      navigate(generateRoute.newsDetail(news.id));
    }
  };

  const handleViewAllClick = () => {
    navigate("/news");
  };

  // Компонент загрузки
  const LoadingState = () => (
    <div className="news-grid">
      {[...Array(5)].map((_, index) => (
        <div key={index} className={`news-item ${index === 0 ? "large" : ""}`}>
          <div className="news-image" style={{ backgroundColor: "#f0f0f0" }}>
            <div className="news-overlay">
              <div className="news-content">
                <div
                  style={{
                    height: "20px",
                    backgroundColor: "rgba(255,255,255,0.3)",
                    marginBottom: "16px",
                    borderRadius: "2px",
                  }}
                ></div>
                <div className="news-divider"></div>
                <div className="news-bottom">
                  <div
                    style={{
                      height: "12px",
                      width: "100px",
                      backgroundColor: "rgba(255,255,255,0.3)",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Компонент пустого состояния
  const EmptyState = () => (
    <div className="news-grid">
      <div className="news-item large">
        <div
          className="news-image"
          style={{
            backgroundColor: "#f4f1e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "#666",
              padding: "40px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                opacity: 0.5,
              }}
            >
              📰
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "300",
                margin: "0 0 8px 0",
              }}
            >
              {t('news.noNews')}
            </h3>
            <p
              style={{
                fontSize: "14px",
                opacity: 0.7,
                margin: 0,
              }}
            >
              {t('news.noNewsDescription')}
            </p>
          </div>
        </div>
      </div>
      {[...Array(4)].map((_, index) => (
        <div key={index} className="news-item">
          <div
            className="news-image"
            style={{
              backgroundColor: "#f9f9f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "#ccc",
                fontSize: "24px",
              }}
            >
              📄
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Компонент ошибки
  const ErrorState = () => (
    <div className="news-grid">
      <div className="news-item large">
        <div
          className="news-image"
          style={{
            backgroundColor: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "#dc2626",
              padding: "40px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
              }}
            >
              ⚠️
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "300",
                margin: "0 0 8px 0",
              }}
            >
              {t('news.error')}
            </h3>
            <p
              style={{
                fontSize: "14px",
                opacity: 0.8,
                margin: "0 0 16px 0",
              }}
            >
              {t('news.errorDescription')}
            </p>
            <button
              onClick={loadNews}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {t('news.retry')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="NewsSection">
      <div className="NewsSection-container">
        <div className="news-header">
          <h2>{t('news.title')}</h2>
          {newsData.length > 0 && (
            <button className="view-all-btn" onClick={handleViewAllClick}>
              {t('news.readAll')}
            </button>
          )}
        </div>

        {loading && <LoadingState />}

        {error && !loading && <ErrorState />}

        {!loading && !error && newsData.length === 0 && <EmptyState />}

        {!loading && !error && newsData.length > 0 && (
          <div className="news-grid">
            {newsData.map((news) => (
              <div
                key={news.id}
                className={`news-item ${news.isLarge ? "large" : ""}`}
                onClick={() => handleNewsClick(news)}
              >
                <div
                  className="news-image"
                  style={{ backgroundImage: `url(${news.image})` }}
                >
                  <div className="news-overlay">
                    <div className="news-content">
                      <h3 className="news-title">{news.title}</h3>
                      <div className="news-divider"></div>
                      <div className="news-bottom">
                        <span className="news-date">{news.date}</span>
                        {/* Показываем кнопку только для больших карточек на десктопе */}
                        {news.isLarge && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNewsClick(news);
                            }}
                            className="news-button desktop-only"
                          >
                            {news.externalUrl ? t('news.goToLink') : t('news.readMore')}
                            <img
                              src={ArrowIcon}
                              className="arrow"
                              alt="arrow"
                            />
                          </button>
                        )}
                        {/* Стрелка для всех карточек (на мобильных) или для маленьких (на десктопе) */}
                        <img
                          src={ArrowIcon}
                          className={`arrow-only ${
                            news.isLarge ? "mobile-only" : ""
                          }`}
                          alt="arrow"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && newsData.length > 0 && (
          <button className="mobile-view-all-btn" onClick={handleViewAllClick}>
            {t('news.readAll')}
          </button>
        )}
      </div>
    </div>
  );
}
