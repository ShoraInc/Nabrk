// pages/Page/Page.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BlockRenderer from "../../components/blocks/BlockRenderer";
import useMobileDetection from "../../hooks/useMobileDetection"; // Исправлен путь
import { useLanguage } from "../../context/LanguageContext";
import pagesApi from "../../api/pagesApi";
import "./Page.scss";

export default function Page() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { currentLanguage } = useLanguage();
  const isMobile = useMobileDetection();

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      const pageData = await pagesApi.getPublishedPageBySlug(slug);
      setPage(pageData);
    } catch (err) {
      console.error("Error loading page:", err);

      // Проверяем, это 404 ошибка или другая проблема
      if (
        err.message.includes("404") ||
        err.message.includes("не найдена") ||
        err.message.includes("not found")
      ) {
        setNotFound(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page__loading">
        <div className="page__loading-text">Загрузка...</div>
      </div>
    );
  }

  // Страница не найдена (404)
  if (notFound) {
    return (
      <div className="page__not-found">
        <h1 className="page__not-found-title">404</h1>
        <h2 className="page__not-found-subtitle">Страница не найдена</h2>
        <p className="page__not-found-description">
          К сожалению, страница "{slug}" не существует или была удалена.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="page__not-found-button"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  // Техническая ошибка
  if (error) {
    return (
      <div className="page__error">
        <h2 className="page__error-title">Ошибка загрузки</h2>
        <p className="page__error-description">
          Произошла ошибка при загрузке страницы: {error}
        </p>
        <button onClick={loadPage} className="page__error-button">
          Попробовать снова
        </button>
      </div>
    );
  }

  // Страница найдена, но нет блоков
  if (!page || !page.blocks || page.blocks.length === 0) {
    return (
      <div className="page">
        <div className="page__empty">
          <h1 className="page__empty-title">{page?.title || "Страница"}</h1>
          <p>На этой странице пока нет контента</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__content">
        {page.blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            currentLanguage={currentLanguage}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}
