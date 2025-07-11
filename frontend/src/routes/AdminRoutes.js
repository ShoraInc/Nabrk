import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminNews from "../admin/components/news/AdminNews";
import AdminNewsDrafts from "../admin/components/news/AdminNewsDrafts";
import AdminNewsForm from "../admin/components/news/AdminNewsForm";

import AdminEvents from "../admin/components/events/AdminEvents";
import AdminEventsDrafts from "../admin/components/events/AdminEventsDrafts";
import AdminEventsForm from "../admin/components/events/AdminEventsForm";

import AdminPages from "../admin/components/pages/AdminPages";
import AdminPagesDrafts from "../admin/components/pages/AdminPagesDrafts";
import AdminPagesForm from "../admin/components/pages/AdminPagesForm";

import AdminBlocksManager from "../admin/components/blocks/AdminBlocksManager";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Редирект с /admin на /admin/pages */}
      <Route path="/" element={<Navigate to="/admin/pages" replace />} />

      {/* ==========================================
          СТРАНИЦЫ (PAGES)
          ========================================== */}
      <Route path="/pages" element={<AdminPages />} />
      <Route path="/pages/drafts" element={<AdminPagesDrafts />} />
      <Route path="/pages/create" element={<AdminPagesForm />} />
      <Route path="/pages/edit/:id" element={<AdminPagesForm />} />

      {/* Управление блоками страницы */}
      <Route path="/pages/:pageId/blocks" element={<AdminBlocksManager />} />

      {/* ==========================================
          НОВОСТИ (NEWS)
          ========================================== */}
      <Route path="/news" element={<AdminNews />} />
      <Route path="/news/drafts" element={<AdminNewsDrafts />} />
      <Route path="/news/create" element={<AdminNewsForm />} />
      <Route path="/news/edit/:id" element={<AdminNewsForm />} />

      {/* ==========================================
          СОБЫТИЯ (EVENTS)
          ========================================== */}
      <Route path="/events" element={<AdminEvents />} />
      <Route path="/events/drafts" element={<AdminEventsDrafts />} />
      <Route path="/events/create" element={<AdminEventsForm />} />
      <Route path="/events/edit/:id" element={<AdminEventsForm />} />

      {/* 404 для админки */}
      <Route path="*" element={<AdminNotFound />} />
    </Routes>
  );
};

// 404 страница для админки
const AdminNotFound = () => (
  <div className="flex min-h-screen bg-gray-100">
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-xl text-gray-600 mb-4">
          Админская страница не найдена
        </h2>
        <p className="text-gray-500 mb-8">
          Запрашиваемая админская страница не существует
        </p>
        <button
          onClick={() => (window.location.href = "/admin/pages")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Вернуться к страницам
        </button>
      </div>
    </div>
  </div>
);

export default AdminRoutes;
