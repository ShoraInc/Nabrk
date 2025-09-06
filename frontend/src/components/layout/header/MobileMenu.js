import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import LanguageSelector from "../../LanguageSelector/LanguageSelector";
import menuApi from "../../../api/menuApi";
import { openLoginModal } from "../../../store/modalSlice";
import { useDispatch } from "react-redux";
import "./MobileMenu.scss";

const MobileMenu = ({ isOpen, onClose }) => {
  const { currentLanguage } = useLanguage();
  const [menuItems, setMenuItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Загрузка меню при открытии
  useEffect(() => {
    if (isOpen) {
      const loadMenu = async () => {
        try {
          const menu = await menuApi.getMenu();
          setMenuItems(menu);
        } catch (error) {
          console.error("Ошибка загрузки меню:", error);
        } finally {
          setLoading(false);
        }
      };

      loadMenu();
    }
  }, [isOpen]);

  // Функция для получения названия пункта меню на текущем языке
  const getMenuItemTitle = (item) => {
    switch (currentLanguage) {
      case 'kz':
        return item.titleKz || item.titleRu || item.titleEn;
      case 'ru':
        return item.titleRu || item.titleKz || item.titleEn;
      case 'en':
        return item.titleEn || item.titleRu || item.titleKz;
      default:
        return item.titleRu || item.titleKz || item.titleEn;
    }
  };

  // Функция для переключения раскрытия пункта меню
  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Функция для обработки клика по пункту меню
  const handleMenuItemClick = (item) => {
    if (item.children && item.children.length > 0) {
      // Если есть подпункты, переключаем их отображение
      toggleExpanded(item.id);
    } else {
      // Если нет подпунктов, переходим по ссылке и закрываем меню
      if (item.type === 'link' && item.url) {
        window.open(item.url, '_blank');
      } else if (item.type === 'page' && item.pageSlug) {
        window.location.href = `/${item.pageSlug}`;
      }
      onClose();
    }
  };

  // Функция для обработки клика по подпункту
  const handleSubItemClick = (subItem) => {
    if (subItem.type === 'link' && subItem.url) {
      window.open(subItem.url, '_blank');
    } else if (subItem.type === 'page' && subItem.pageSlug) {
      window.location.href = `/${subItem.pageSlug}`;
    }
    onClose();
  };

  // Функция для обработки клика по кнопке входа
  const handleLoginClick = () => {
    dispatch(openLoginModal());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay">
      <div className="mobile-menu">
        {/* Заголовок */}
        <div className="mobile-menu__header">
          <div className="mobile-menu__logo">
            <img src="/assets/logo/nabrk_logo.png" alt="NABRK" />
          </div>
          
          {/* Селектор языка */}
          <div className="mobile-menu__language-selector">
            <LanguageSelector isMobile={true} />
          </div>
          
          <button
            onClick={onClose}
            className="mobile-menu__close"
            aria-label="Закрыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Навигация */}
        <nav className="mobile-menu__nav">
          {loading ? (
            <div className="mobile-menu__loading">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : (
            <ul className="mobile-menu__list">
              {menuItems.map((item) => (
                <li key={item.id} className="mobile-menu__item">
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className="mobile-menu__item-button"
                  >
                    <span className="mobile-menu__item-text">
                      {getMenuItemTitle(item)}
                    </span>
                    {item.children && item.children.length > 0 && (
                      <svg
                        className={`mobile-menu__item-arrow ${
                          expandedItems[item.id] ? 'mobile-menu__item-arrow--expanded' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Подпункты */}
                  {item.children && item.children.length > 0 && expandedItems[item.id] && (
                    <ul className="mobile-menu__submenu">
                      {item.children.map((subItem) => (
                        <li key={subItem.id} className="mobile-menu__subitem">
                          <button
                            onClick={() => handleSubItemClick(subItem)}
                            className="mobile-menu__subitem-button"
                            data-type={subItem.type}
                          >
                            {getMenuItemTitle(subItem)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* Футер с кнопкой входа */}
        <div className="mobile-menu__footer">
          <div className="mobile-menu__footer-content">
            {/* Кнопка входа */}
            <button 
              onClick={handleLoginClick}
              className="mobile-menu__login-button"
            >
              Кіру / Войти / Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
