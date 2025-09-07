// components/Header.js
import React, { useState, useEffect } from "react";
import "./Header.scss";
import LanguageSelector from "../../LanguageSelector/LanguageSelector";
import useMobileDetection from "../../../hooks/useMobileDetection";
import Logo from "../../../assets/logos/Logo.png";
import { useTranslations } from "../../../hooks/useTranslations";
import { useLanguage } from "../../../context/LanguageContext";
import menuApi from "../../../api/menuApi";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const isMobile = useMobileDetection();
  const { t } = useTranslations();
  const { currentLanguage } = useLanguage();
  const [menuItems, setMenuItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Загрузка меню при монтировании компонента
  useEffect(() => {
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
  }, []);

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

  // Функция для обработки клика по пункту меню
  const handleMenuItemClick = (item) => {
    if (item.children && item.children.length > 0) {
      // Закрываем все другие открытые пункты
      const newExpandedItems = {};
      // Открываем только текущий пункт
      newExpandedItems[item.id] = !expandedItems[item.id];
      setExpandedItems(newExpandedItems);
    } else {
      // Если нет подпунктов, переходим по ссылке
      if (item.type === 'link' && item.url) {
        window.open(item.url, '_blank');
      } else if (item.type === 'page' && item.pageSlug) {
        window.location.href = `/page/${item.pageSlug}`;
      }
    }
  };

  // Функция для обработки клика по подпункту
  const handleSubItemClick = (subItem) => {
    if (subItem.type === 'link' && subItem.url) {
      window.open(subItem.url, '_blank');
    } else if (subItem.type === 'page' && subItem.pageSlug) {
      window.location.href = `/page/${subItem.pageSlug}`;
    }
  };

  return (
    <header className="main-header">
      <div className="main-header__container">
        <div className="main-header__logo">
          <div className="main-header__logo-placeholder">
            <img src={Logo} alt="Logo" />
          </div>
        </div>

        {/* Кнопка мобильного меню */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="main-header__mobile-menu-button"
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {!isMobile && (
          <nav className="main-header__nav">
            {loading ? (
              <div className="flex items-center space-x-4">
                <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              </div>
            ) : (
              menuItems.map((item) => (
                <div key={item.id} className="relative main-header__nav-item-container">
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className="main-header__nav-item main-header__nav-item--dropdown"
                  >
                    {getMenuItemTitle(item)}
                    {item.children && item.children.length > 0 && (
                      <svg
                        className={`ml-1 w-4 h-4 transform transition-transform ${
                          expandedItems[item.id] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Выпадающее меню */}
                  {item.children && item.children.length > 0 && expandedItems[item.id] && (
                    <div className="main-header__dropdown-menu">
                      {item.children.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          className="main-header__dropdown-item"
                          data-type={subItem.type}
                        >
                          {getMenuItemTitle(subItem)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </nav>
        )}

        {!isMobile && <LanguageSelector isMobile={isMobile} />}
      </div>
      <div className="main-header__border"></div>

      {/* Мобильное меню */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
