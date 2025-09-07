// Cabinet/components/RequestHistory.js
import React, { useState, useEffect } from 'react';
import { Clock, Trash2, RefreshCw } from 'lucide-react';

const RequestHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Временные данные - в будущем заменить на API call
  const mockHistory = [
    // Пустой массив для демонстрации отсутствия истории
    // В будущем здесь будут реальные записи истории
  ];

  useEffect(() => {
    fetchRequestHistory();
  }, []);

  const fetchRequestHistory = async () => {
    setLoading(true);
    try {
      // TODO: Заменить на реальный API call
      // const response = await api.get('/request-history');
      // setHistory(response.data);
      
      // Временная имитация API call
      setTimeout(() => {
        setHistory(mockHistory);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error('Error fetching request history:', error);
      setLoading(false);
    }
  };

  const handleViewHistory = () => {
    // TODO: Логика для просмотра истории
    console.log('Viewing request history');
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Вы уверены, что хотите очистить всю историю запросов?')) {
      return;
    }

    try {
      // TODO: API call для очистки истории
      // await api.delete('/request-history');
      console.log('Clearing request history');
      
      setHistory([]);
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error clearing history:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleDeleteHistoryItem = async (itemId) => {
    try {
      // TODO: API call для удаления конкретного элемента истории
      // await api.delete(`/request-history/${itemId}`);
      console.log('Deleting history item:', itemId);
      
      setHistory(history.filter(item => item.id !== itemId));
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error deleting history item:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleRefreshHistory = () => {
    fetchRequestHistory();
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>История запросов</h2>
        </div>
        <div className="empty-state">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>История запросов</h2>
        <div className="header-actions">
          <button className="icon-btn" onClick={handleRefreshHistory} title="Обновить">
            <RefreshCw size={20} />
          </button>
          {history.length > 0 && (
            <button className="icon-btn" onClick={handleClearHistory} title="Очистить историю">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
      
      <div className="info-banner">
        <div className="info-icon">ℹ️</div>
        <div>
          <p>Максимальное количество изданий в разделе - 10.</p>
          <p>При превышении данного количества, издания будут удаляться системой автоматически</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <p>История запросов пуста</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Запрос</th>
                <th>Дата и время</th>
                <th>Результаты</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="item-title">{item.query}</div>
                    {item.filters && (
                      <div className="item-author">Фильтры: {item.filters}</div>
                    )}
                  </td>
                  <td>{item.timestamp}</td>
                  <td>{item.resultsCount} результатов</td>
                  <td>
                    <span className={`status ${item.status === 'completed' ? 'completed' : 'open'}`}>
                      {item.status === 'completed' ? 'Завершен' : 'В процессе'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteHistoryItem(item.id)}
                      >
                        <Trash2 size={16} />
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestHistory;