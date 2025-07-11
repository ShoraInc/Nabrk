// components/admin/AdminPages.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pagesApi from '../../../api/pagesApi';
import AdminSidebar from '../../components/shared/AdminSidebar';
import { ADMIN_ROUTES, generateRoute } from '../../../routes/constants';

const AdminPages = () => {
  const [pages, setPages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [pagesData, statsData] = await Promise.all([
        pagesApi.getPublishedPagesAdmin(),
        pagesApi.getPagesStats()
      ]);
      
      setPages(pagesData);
      setStats(statsData);
      setTotalPages(Math.ceil(pagesData.length / 10) || 1);
    } catch (err) {
      setError(err.message);
      console.error('Error loading pages data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async (pageId) => {
    if (!window.confirm('Вы уверены, что хотите снять страницу с публикации?')) {
      return;
    }

    try {
      setActionLoading(pageId);
      await pagesApi.unpublishPage(pageId);
      await loadData();
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
      console.error('Error unpublishing page:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (pageId, pageTitle) => {
    if (!window.confirm(`Вы уверены, что хотите удалить страницу "${pageTitle}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      setActionLoading(pageId);
      await pagesApi.deletePage(pageId, true);
      await loadData();
    } catch (err) {
      alert(`Ошибка: ${err.message}`);
      console.error('Error deleting page:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? 'ml-64' : 'ml-16'
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
          <h1 className="text-2xl font-bold text-gray-800">Управление страницами</h1>
          <p className="text-gray-600 mt-2">Все опубликованные страницы</p>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {stats.pageStats?.find(s => s.status === 'published')?.count || 0}
              </div>
              <div className="text-sm text-gray-600">Опубликованные</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pageStats?.find(s => s.status === 'draft')?.count || 0}
              </div>
              <div className="text-sm text-gray-600">Черновики</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">{stats.totalBlocks}</div>
              <div className="text-sm text-gray-600">Всего блоков</div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => navigate(ADMIN_ROUTES.PAGES_CREATE)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Создать страницу
          </button>
          <button
            onClick={() => navigate(ADMIN_ROUTES.PAGES_DRAFTS)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📝 Черновики ({stats?.pageStats?.find(s => s.status === 'draft')?.count || 0})
          </button>
        </div>

        {/* Таблица страниц */}
        <div className="bg-white rounded-lg shadow">
          {pages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-4">Опубликованных страниц пока нет</p>
              <button
                onClick={() => navigate(ADMIN_ROUTES.PAGES_CREATE)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Создать первую страницу
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
                          <a 
                            href={`/${page.slug}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 hover:underline"
                          >
                            {page.title}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                          /{page.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-medium">
                        {page.blocks?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(page.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(generateRoute.adminPageBlocks(page.id))}
                          className="text-pink-600 hover:text-pink-900"
                        >
                          Редактировать блоков
                        </button>
                        <button
                          onClick={() => navigate(generateRoute.adminPageEdit(page.id))}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleUnpublish(page.id)}
                          disabled={actionLoading === page.id}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                        >
                          {actionLoading === page.id ? 'Снимаем...' : 'Снять с публикации'}
                        </button>
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          disabled={actionLoading === page.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {actionLoading === page.id ? 'Удаляем...' : 'Удалить'}
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
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Предыдущая
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default AdminPages;