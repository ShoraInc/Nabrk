import React, { useState, useEffect } from "react";
import "./Hero.scss";
// import HeroImage from "../../../../assets/images/hero-image.png";
import { openLoginModal } from "../../../../store/modalSlice";
import { useDispatch } from "react-redux";
import { useTranslations } from "../../../../hooks/useTranslations";
import LanguageSelector from "../../../../components/LanguageSelector/LanguageSelector";
import useMobileDetection from "../../../../hooks/useMobileDetection";
import { useLanguage } from "../../../../context/LanguageContext";
import menuApi from "../../../../api/menuApi";
import MobileMenu from "../../../../components/layout/header/MobileMenu";

const Header = ({ isTransparent = false }) => {
  const { t } = useTranslations();
  const { currentLanguage } = useLanguage();
  const [activeNav, setActiveNav] = useState(t('header.home'));
  const isMobile = useMobileDetection();
  const [menuItems, setMenuItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();

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

  const handleOpenModal = () => {
    dispatch(openLoginModal()); // Отправляем действие openModal в store
  };
  return (
    <header className={`header ${isTransparent ? "header--transparent" : ""}`}>
      <div className="header__container">
        <div className="header__logo">
          <img
            src="/assets/logo/nabrk_logo.png"
            alt="Логотип"
            width="120"
            height="60"
            className="header__logo"
          />
        </div>

        {!isMobile && (
          <nav className="header__nav">
            {loading ? (
              <div className="flex items-center space-x-4">
                <div className="animate-pulse h-4 w-20 rounded" style={{backgroundColor: '#d2ac2d'}}></div>
                <div className="animate-pulse h-4 w-24 rounded" style={{backgroundColor: '#d2ac2d'}}></div>
                <div className="animate-pulse h-4 w-16 rounded" style={{backgroundColor: '#d2ac2d'}}></div>
              </div>
            ) : (
              menuItems.map((item) => (
                <div key={item.id} className="header__nav-dropdown">
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className="header__nav-item"
                  >
                    {getMenuItemTitle(item).toUpperCase()}
                    {item.children && item.children.length > 0 && (
                      <span className={`header__nav-arrow ${expandedItems[item.id] ? 'header__nav-arrow--expanded' : ''}`}>
                        ▼
                      </span>
                    )}
                  </button>
                  
                  {/* Выпадающее меню */}
                  {item.children && item.children.length > 0 && expandedItems[item.id] && (
                    <div className="header__dropdown-menu">
                      {item.children.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          className="header__dropdown-item"
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

        <div className="header__auth">
          {!isMobile && <LanguageSelector variant="default" />}
          <button onClick={handleOpenModal} className="header__login-btn">
            {t('header.login').toUpperCase()}
            <span className="header__login-arrow">→</span>
          </button>
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="header__menu-btn"
              aria-label="Открыть меню"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </div>
      <div className="header__border"></div>

      {/* Мобильное меню */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

const Hero = () => {
  const { t } = useTranslations();
  
  return (
    <div className="home-page">
      <Header isTransparent={true} />

      <main className="hero">
        <div className="hero__image">
          {/* <img src={HeroImage} alt="Қазақстан Ұлттық Кітапханасы" /> */}
        </div>
        <div className="hero__overlay"></div>
        <div className="hero__content">
          <h1 className="hero__title">
            {t('hero.title').split(' ').map((word, index, array) => (
              <React.Fragment key={index}>
                {word}
                {index < array.length - 1 && (index + 1) % 2 === 0 ? <br /> : ' '}
              </React.Fragment>
            ))}
          </h1>

          <div className="hero__buttons">
            <button className="hero__btn hero__btn--primary">
              {t('hero.button1')}<span className="hero__btn-arrow">→</span>
            </button>
            <button className="hero__btn hero__btn--secondary">
              {t('hero.button2')}<span className="hero__btn-arrow">▷</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
