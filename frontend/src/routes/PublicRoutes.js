// routes/PublicRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/homePage/home";
import News from "../pages/NewsPage/News";
import NewsDetail from "../pages/NewsDetailPage/NewsDetail";
import Page from "../pages/Page/Page";

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Главная страница */}
      <Route path="/" element={<Home />} />

      {/* Новости */}
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetail />} />

      {/* Динамические страницы */}
      <Route path="/page/:slug" element={<Page />} />

      {/* 404 для публичных страниц */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Простая 404 страница
const NotFoundPage = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      textAlign: "center",
      padding: "40px",
    }}
  >
    <h1 style={{ fontSize: "48px", color: "#333", marginBottom: "16px" }}>
      404
    </h1>
    <h2 style={{ color: "#666", marginBottom: "16px" }}>Страница не найдена</h2>
    <p style={{ color: "#999", marginBottom: "32px" }}>
      К сожалению, запрашиваемая страница не существует
    </p>
    <button
      onClick={() => (window.location.href = "/")}
      style={{
        padding: "12px 24px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Вернуться на главную
    </button>
  </div>
);

export default PublicRoutes;
