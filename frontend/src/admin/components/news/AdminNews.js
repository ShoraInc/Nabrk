import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewsApi from "../../../api/newsApi";
import AdminSidebar from "../../components/shared/AdminSidebar";
import { ADMIN_ROUTES, generateRoute } from "../../../routes/constants";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await NewsApi.getAllNews({
        page: currentPage,
        limit: 10,
      });
      setNews(data.news || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Ошибка при загрузке новостей");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await NewsApi.publishNews(id);
      fetchNews();
    } catch (err) {
      alert("Ошибка при публикации новости");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await NewsApi.unpublishNews(id);
      fetchNews();
    } catch (err) {
      alert("Ошибка при отмене публикации");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту новость?")) {
      try {
        await NewsApi.deleteNews(id);
        fetchNews();
      } catch (err) {
        alert("Ошибка при удалении новости");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
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
            Управление новостями
          </h1>
          <p className="text-gray-600 mt-2">Все опубликованные новости</p>
        </div>

        {/* Кнопка создания новости */}
        <div className="mb-6">
          <button
            onClick={() => navigate(ADMIN_ROUTES.NEWS_CREATE)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Создать новость
          </button>
        </div>

        {/* Таблица новостей */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Изображение
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заголовок
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Просмотры
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата публикации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">📷</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      {item.shortDescription && (
                        <div className="text-sm text-gray-500 mt-1">
                          {item.shortDescription.substring(0, 100)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.publishedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() =>
                          navigate(generateRoute.adminNewsEdit(item.id))
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleUnpublish(item.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Снять с публикации
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

export default AdminNews;
