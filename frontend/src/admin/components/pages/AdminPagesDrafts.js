// components/admin/AdminPagesDrafts.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pagesApi from "../../../api/pagesApi";
import AdminSidebar from "../../components/shared/AdminSidebar";
import { generateRoute } from "../../../routes/constants";

const AdminPagesDrafts = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPages();
  }, [currentPage]);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pagesApi.getDraftPages();
      setPages(data);
      setTotalPages(Math.ceil(data.length / 10) || 1);
    } catch (err) {
      setError(err.message);
      console.error("Error loading draft pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (pageId) => {
    try {
      setActionLoading(pageId);
      await pagesApi.publishPage(pageId);
      await loadPages();
    } catch (err) {
      alert(`Ошибка при публикации: ${err.message}`);
      console.error("Error publishing page:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (pageId, pageTitle) => {
    if (
      !window.confirm(`Вы уверены, что хотите удалить черновик "${pageTitle}"?`)
    ) {
      return;
    }

    try {
      setActionLoading(pageId);
      await pagesApi.deletePage(pageId);
      await loadPages();
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
      console.error("Error deleting page:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canPublish = (page) => {
    return page.blocks && page.blocks.length > 0;
  };

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? "ml-64" : "ml-16"
  }`;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar onToggle={setSidebarExpanded} />
        <div className={contentClass}>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar onToggle={setSidebarExpanded} />
        <div className={contentClass}>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onToggle={setSidebarExpanded} />

      <div className={contentClass}>
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Черновики страниц
          </h1>
          <p className="text-gray-600 mt-2">Неопубликованные страницы</p>
        </div>

        {/* Кнопки действий */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => navigate("/admin/pages/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Создать страницу
          </button>
          <button
            onClick={() => navigate("/admin/pages")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📄 Опубликованные
          </button>
        </div>

        {/* Таблица черновиков */}
        <div className="bg-white rounded-lg shadow">
          {pages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-4">Черновиков страниц пока нет</p>
              <button
                onClick={() => navigate("/admin/pages/create")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Создать страницу
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Блоков
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Создано
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Обновлено
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                          {!canPublish(page) && (
                            <div className="text-xs text-yellow-600 mt-1 flex items-center">
                              ⚠️ Нет блоков для публикации
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            Черновик
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                          /{page.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`font-medium ${
                            page.blocks?.length
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {page.blocks?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(page.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(page.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() =>
                            navigate((generateRoute.adminPageBlocks(page.id)))
                          }
                          className="text-pink-600 hover:text-pink-900"
                        >
                          Редактировать блоков
                        </button>
                        <button
                          onClick={() =>
                            navigate(generateRoute.adminPageEdit(page.id))
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handlePublish(page.id)}
                          disabled={
                            actionLoading === page.id || !canPublish(page)
                          }
                          className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            !canPublish(page)
                              ? "Добавьте блоки для публикации"
                              : ""
                          }
                        >
                          {actionLoading === page.id
                            ? "Публикуем..."
                            : "Опубликовать"}
                        </button>
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          disabled={actionLoading === page.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {actionLoading === page.id ? "Удаляем..." : "Удалить"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Предыдущая
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Следующая
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPagesDrafts;
