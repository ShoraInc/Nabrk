// Cabinet/components/ElectronicDelivery.js
import React, { useState, useEffect } from 'react';
import { ShoppingCart, FileText, X } from 'lucide-react';

const ElectronicDelivery = () => {
  const [deliveryDocs, setDeliveryDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Временные данные - в будущем заменить на API call
  const mockDeliveryDocs = [
    {
      id: 1,
      title: 'СЛОВА НАЗИДАНИЯ',
      author: 'АБАЙ',
      date: '05.03.2014',
      status: 'Выполнен',
      downloadUrl: '/documents/1.pdf'
    },
    {
      id: 2,
      title: 'ЭНЕРГЕТИЧЕСКОЕ СОТРУДНИЧЕСТВО КАЗАХСТАНА И КИТАЯ: ГЕОПОЛИТИЧЕСКИЙ АСПЕКТ',
      author: 'СҮЛЕЙМЕН ҮСЕН АБДҰХАДЫРҰЛЫ',
      date: '30.04.2015',
      status: 'Выполнен',
      downloadUrl: '/documents/2.pdf'
    },
    {
      id: 3,
      title: 'ЭНЕРГЕТИЧЕСКОЕ СОТРУДНИЧЕСТВО КАЗАХСТАНА И КИТАЯ: ГЕОПОЛИТИЧЕСКИЙ АСПЕКТ',
      author: 'СҮЛЕЙМЕН ҮСЕН АБДҰХАДЫРҰЛЫ',
      date: '30.04.2015',
      status: 'Выполнен',
      downloadUrl: '/documents/3.pdf'
    },
    {
      id: 4,
      title: 'ЭКОНОМИКА ЖӘНЕ ҚАСІПКЕРЛІК НЕГІЗДЕРІ',
      author: 'ХАМИТОВА, КҮЛЗАЙДА ЗӘКІРҚЫЗЫ',
      date: '19.11.2015',
      status: 'Открыт',
      downloadUrl: null
    }
  ];

  useEffect(() => {
    fetchDeliveryDocs();
  }, []);

  const fetchDeliveryDocs = async () => {
    setLoading(true);
    try {
      // TODO: Заменить на реальный API call
      // const response = await api.get('/electronic-delivery');
      // setDeliveryDocs(response.data);
      
      // Временная имитация API call
      setTimeout(() => {
        setDeliveryDocs(mockDeliveryDocs);
        setLoading(false);
      }, 900);
    } catch (error) {
      console.error('Error fetching delivery documents:', error);
      setLoading(false);
    }
  };

  const handleAddElectronicCopy = async (docId) => {
    try {
      // TODO: API call для добавления электронной копии
      // await api.post(`/electronic-delivery/${docId}/electronic-copy`);
      console.log('Adding electronic copy for document:', docId);
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error adding electronic copy:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleAddToReadingRoom = async (docId) => {
    try {
      // TODO: API call для добавления в читальный зал
      // await api.post(`/electronic-delivery/${docId}/reading-room`);
      console.log('Adding to reading room for document:', docId);
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error adding to reading room:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleCancelOrder = async (docId) => {
    try {
      // TODO: API call для отмены заказа
      // await api.post(`/electronic-delivery/${docId}/cancel`);
      console.log('Canceling order for document:', docId);
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error canceling order:', error);
      // Показать уведомление об ошибке
    }
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Электронная доставка документов</h2>
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
        <h2>Электронная доставка документов ({deliveryDocs.length})</h2>
      </div>
      
      {deliveryDocs.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <p>Документы для электронной доставки отсутствуют</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Наименование / Автор</th>
                <th>Дата заказа</th>
                <th>Статус</th>
                <th>Заказать</th>
              </tr>
            </thead>
            <tbody>
              {deliveryDocs.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="item-title">{doc.title}</div>
                    <div className="item-author">{doc.author}</div>
                  </td>
                  <td>{doc.date}</td>
                  <td>
                    <span className={`status ${doc.status === 'Выполнен' ? 'completed' : 'open'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn add-copy"
                        onClick={() => handleAddElectronicCopy(doc.id)}
                      >
                        <ShoppingCart size={16} />
                        Добавить электронную копию (+)
                      </button>
                      <button 
                        className="action-btn add-reading"
                        onClick={() => handleAddToReadingRoom(doc.id)}
                      >
                        <FileText size={16} />
                        Добавить в читальный зал (+)
                      </button>
                      {doc.status === 'Открыт' && (
                        <button 
                          className="action-btn cancel-btn"
                          onClick={() => handleCancelOrder(doc.id)}
                        >
                          <X size={16} />
                          Отменить заказ
                        </button>
                      )}
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

export default ElectronicDelivery;