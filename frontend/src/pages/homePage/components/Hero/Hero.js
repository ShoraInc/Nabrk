import React, { useState } from "react";
import "./Hero.scss";
// import HeroImage from "../../../../assets/images/hero-image.png";
import { openLoginModal } from "../../../../store/modalSlice";
import { useDispatch } from "react-redux";
import { useTranslations } from "../../../../hooks/useTranslations";
import LanguageSelector from "../../../../components/LanguageSelector/LanguageSelector";
import useMobileDetection from "../../../../hooks/useMobileDetection";

const Header = ({ isTransparent = false }) => {
  const { t } = useTranslations();
  const [activeNav, setActiveNav] = useState(t('header.home'));
  const isMobile = useMobileDetection();

  const dispatch = useDispatch();

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

        <nav className="header__nav">
          <a
            href="#"
            className={`header__nav-link ${
              activeNav === t('header.home') ? "header__nav-link--active" : ""
            }`}
            onClick={() => setActiveNav(t('header.home'))}
          >
            {t('header.home').toUpperCase()}
          </a>
          <div className="header__nav-dropdown">
            <a
              href="#"
              className={`header__nav-link ${
                activeNav === t('header.library') ? "header__nav-link--active" : ""
              }`}
              onClick={() => setActiveNav(t('header.library'))}
            >
              {t('header.library').toUpperCase()}
              <span className="header__nav-arrow">▼</span>
            </a>
          </div>
          <div className="header__nav-dropdown">
            <a
              href="#"
              className={`header__nav-link ${
                activeNav === t('header.readers') ? "header__nav-link--active" : ""
              }`}
              onClick={() => setActiveNav(t('header.readers'))}
            >
              {t('header.readers').toUpperCase()}
              <span className="header__nav-arrow">▼</span>
            </a>
          </div>
          <div className="header__nav-dropdown">
            <a
              href="#"
              className={`header__nav-link ${
                activeNav === t('header.resources') ? "header__nav-link--active" : ""
              }`}
              onClick={() => setActiveNav(t('header.resources'))}
            >
              {t('header.resources').toUpperCase()}
              <span className="header__nav-arrow">▼</span>
            </a>
          </div>
        </nav>

        <div className="header__auth">
          <LanguageSelector variant="default" />
          <button onClick={handleOpenModal} className="header__login-btn">
            {t('header.login').toUpperCase()}
            <span className="header__login-arrow">→</span>
          </button>
          <button className="header__menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className="header__border"></div>
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
