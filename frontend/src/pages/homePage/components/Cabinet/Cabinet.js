// Cabinet/Cabinet.js
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  MessageSquare, 
  Download, 
  Clock, 
  Lock
} from 'lucide-react';

// Import components
import MyOrders from './components/MyOrders/MyOrders';
import Favorites from './components/Favorites/Favorites';
import Messages from './components/Messages/Messages';
import ElectronicDelivery from './components/ElectronicDelivery/ElectronicDelivery';
import RequestHistory from './components/RequestHistory/RequestHistory';
import ChangePassword from './components/ChangePassword/ChangePassword';

// Import styles
import './Cabinet.scss';

const Cabinet = () => {
  const [currentPage, setCurrentPage] = useState('orders');

  const sidebarItems = [
    { id: 'orders', icon: ShoppingBag, label: 'Мои заказы', count: 90 },
    { id: 'favorites', icon: Star, label: 'Избранное', count: 3 },
    { id: 'messages', icon: MessageSquare, label: 'Мои сообщения', count: 0 },
    { id: 'delivery', icon: Download, label: 'Электронная доставка документов', count: 9 },
    { id: 'history', icon: Clock, label: 'История запросов', count: null },
    { id: 'password', icon: Lock, label: 'Сменить пароль', count: null }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'orders':
        return <MyOrders />;
      case 'favorites':
        return <Favorites />;
      case 'messages':
        return <Messages />;
      case 'delivery':
        return <ElectronicDelivery />;
      case 'history':
        return <RequestHistory />;
      case 'password':
        return <ChangePassword />;
      default:
        return <MyOrders />;
    }
  };

  return (
    <div className="cabinet-page">
      <div className="cabinet-sidebar">
        <div className="cabinet-header">
          <div className="user-info">
            <div className="avatar">Ж</div>
            <div className="user-details">
              <h3>Жолдыбалинов Нуржан</h3>
              <p>shark@mail.ru</p>
            </div>
          </div>
        </div>

        <div className="cabinet-menu">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <div className="menu-item-content">
                  <div className="menu-item-left">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className="count">{item.count}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="cabinet-main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Cabinet;