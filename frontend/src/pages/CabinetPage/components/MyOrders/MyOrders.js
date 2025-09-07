// Cabinet/components/MyOrders.js
import React, { useState, useEffect } from 'react';
import { ShoppingCart, FileText } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Временные данные - в будущем заменить на API call
  const mockOrders = [
    {
      id: 1,
      title: 'САЛЫҚ КОДЕКСІ',
      department: 'Книгохранение',
      date: '15.05.2025 17:05:12',
      status: 'Закрыт'
    },
    {
      id: 2,
      title: 'ШЫҒАРМАЛАРЫНЫҢ АКАДЕМИЯЛЫҚ ТОЛЫҚ ЖИНАҒЫ',
      author: 'ЖҰМАБАЙҰЛЫ МАҒЖАН',
      department: 'Книгохранение',
      date: '24.04.2025 13:47:52',
      status: 'Закрыт'
    },
    {
      id: 3,
      title: 'ШЫҒАРМАЛАРЫНЫҢ АКАДЕМИЯЛЫҚ ТОЛЫҚ ЖИНАҒЫ',
      author: 'ЖҰМАБАЙҰЛЫ МАҒЖАН',
      department: 'Книгохранение',
      date: '24.04.2025 13:47:39',
      status: 'Закрыт'
    },
    {
      id: 4,
      title: 'ШЫҒАРМАЛАРЫНЫҢ АКАДЕМИЯЛЫҚ ТОЛЫҚ ЖИНАҒЫ',
      author: 'ЖҰМАБАЙҰЛЫ МАҒЖАН',
      department: 'Книгохранение',
      date: '24.04.2025 13:47:25',
      status: 'Закрыт'
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // TODO: Заменить на реальный API call
      // const response = await api.get('/orders');
      // setOrders(response.data);
      
      // Временная имитация API call
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleAddElectronicCopy = async (orderId) => {
    try {
      // TODO: API call для добавления электронной копии
      // await api.post(`/orders/${orderId}/electronic-copy`);
      console.log('Adding electronic copy for order:', orderId);
      // Обновить состояние или показать уведомление об успехе
    } catch (error) {
      console.error('Error adding electronic copy:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleAddToReadingRoom = async (orderId) => {
    try {
      // TODO: API call для добавления в читальный зал
      // await api.post(`/orders/${orderId}/reading-room`);
      console.log('Adding to reading room for order:', orderId);
      // Обновить состояние или показать уведомление об успехе
    } catch (error) {
      console.error('Error adding to reading room:', error);
      // Показать уведомление об ошибке
    }
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Мои заказы</h2>
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
        <h2>Мои заказы ({orders.length})</h2>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Наименование / Автор</th>
              <th>В отдел</th>
              <th>Дата заказа</th>
              <th>Статус</th>
              <th>Заказать</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>
                  <div className="item-title">{order.title}</div>
                  {order.author && <div className="item-author">{order.author}</div>}
                </td>
                <td>{order.department}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`status ${order.status === 'Закрыт' ? 'closed' : 'open'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn add-copy"
                      onClick={() => handleAddElectronicCopy(order.id)}
                    >
                      <ShoppingCart size={16} />
                      Добавить электронную копию
                    </button>
                    <button 
                      className="action-btn add-reading"
                      onClick={() => handleAddToReadingRoom(order.id)}
                    >
                      <FileText size={16} />
                      Добавить в читальный зал
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;