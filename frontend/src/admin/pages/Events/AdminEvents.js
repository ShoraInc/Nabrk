import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventsApi from '../../../api/eventsApi';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await EventsApi.getAllEvents({
        page: currentPage,
        limit: 10
      });
      setEvents(data.events || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Ошибка при загрузке событий');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await EventsApi.activateEvent(id);
      fetchEvents();
    } catch (err) {
      alert('Ошибка при активации события');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await EventsApi.deactivateEvent(id);
      fetchEvents();
    } catch (err) {
      alert('Ошибка при деактивации события');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
      try {
        await EventsApi.deleteEvent(id);
        fetchEvents();
      } catch (err) {
        alert('Ошибка при удалении события');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Весь день';
    const timeParts = timeString.split(':');
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  const isEventUpcoming = (eventDate) => {
    return new Date(eventDate) >= new Date();
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
          <h1 className="text-2xl font-bold text-gray-800">Управление событиями</h1>
          <p className="text-gray-600 mt-2">Все активные события</p>
        </div>

        {/* Кнопка создания события */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/events/create')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Создать событие
          </button>
        </div>

        {/* Таблица событий */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Место
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата и время
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.description && item.description.length > 100
                          ? `${item.description.substring(0, 100)}...`
                          : item.description
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.place}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(item.eventDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(item.eventTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isEventUpcoming(item.eventDate)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isEventUpcoming(item.eventDate) ? 'Предстоящее' : 'Прошедшее'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/admin/events/edit/${item.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDeactivate(item.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Деактивировать
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

export default AdminEvents;