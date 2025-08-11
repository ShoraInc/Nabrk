// Cabinet/components/Messages.js
import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, MailOpen } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Временные данные - в будущем заменить на API call
  const mockMessages = [
    // Пустой массив для демонстрации отсутствия сообщений
    // В будущем здесь будут реальные сообщения
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // TODO: Заменить на реальный API call
      // const response = await api.get('/messages');
      // setMessages(response.data);
      
      // Временная имитация API call
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleViewMessages = () => {
    // TODO: API call для просмотра сообщений
    console.log('Viewing messages');
    // Например, открыть модальное окно или перейти на страницу сообщений
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      // TODO: API call для отметки сообщения как прочитанного
      // await api.patch(`/messages/${messageId}/read`);
      console.log('Marking message as read:', messageId);
      
      // Обновить локальное состояние
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      // TODO: API call для удаления сообщения
      // await api.delete(`/messages/${messageId}`);
      console.log('Deleting message:', messageId);
      
      // Обновить локальное состояние
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Мои сообщения</h2>
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
        <h2>Мои сообщения ({messages.length})</h2>
      </div>
      
      {messages.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={48} />
          <p>Сообщений пока нет</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Статус</th>
                <th>Тема</th>
                <th>От кого</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(message => (
                <tr key={message.id} className={!message.isRead ? 'unread' : ''}>
                  <td>
                    {message.isRead ? (
                      <MailOpen size={16} className="read-icon" />
                    ) : (
                      <Mail size={16} className="unread-icon" />
                    )}
                  </td>
                  <td>
                    <div className="item-title">{message.subject}</div>
                    {message.preview && (
                      <div className="item-author">{message.preview}</div>
                    )}
                  </td>
                  <td>{message.from}</td>
                  <td>{message.date}</td>
                  <td>
                    <div className="action-buttons">
                      {!message.isRead && (
                        <button 
                          className="action-btn"
                          onClick={() => handleMarkAsRead(message.id)}
                        >
                          Отметить как прочитанное
                        </button>
                      )}
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
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

export default Messages;