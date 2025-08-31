import React, { useState } from "react";
import "./Hero.scss";
// import HeroImage from "../../../../assets/images/hero-image.png";
import { openLoginModal } from "../../../../store/modalSlice";
import { useDispatch } from "react-redux";

const Header = ({ isTransparent = false }) => {
  const [activeNav, setActiveNav] = useState("БАСТЫ БЕТ");

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
              activeNav === "БАСТЫ БЕТ" ? "header__nav-link--active" : ""
            }`}
            onClick={() => setActiveNav("БАСТЫ БЕТ")}
          >
            БАСТЫ БЕТ
          </a>
          <div className="header__nav-dropdown">
            <a
              href="#"
              className={`header__nav-link ${
                activeNav === "КІТАПХАНА" ? "header__nav-link--active" : ""
              }`}
              onClick={() => setActiveNav("КІТАПХАНА")}
            >
              КІТАПХАНА
              <span className="header__nav-arrow">▼</span>
            </a>
          </div>
          <div className="header__nav-dropdown">
            <a
              href="#"
              className={`header__nav-link ${
                activeNav === "ОҚЫРМАНДАРҒА" ? "header__nav-link--active" : ""
              }`}
              onClick={() => setActiveNav("ОҚЫРМАНДАРҒА")}
            >
              ОҚЫРМАНДАРҒА
              <span className="header__nav-arrow">▼</span>
            </a>
          </div>
          <div className="header__nav-dropdown">
            <a
              href="#"
              className={`header__nav-link ${
                activeNav === "РЕСУРСТАР" ? "header__nav-link--active" : ""
              }`}
              onClick={() => setActiveNav("РЕСУРСТАР")}
            >
              РЕСУРСТАР
              <span className="header__nav-arrow">▼</span>
            </a>
          </div>
        </nav>

        <div className="header__auth">
          <button onClick={handleOpenModal} className="header__login-btn">
            ЛОГИН
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
            Қазақстан
            <br />
            Республикасының
            <br />
            Ұлттық Академиялық
            <br />
            Кітапханасы
          </h1>

          <div className="hero__buttons">
            <button className="hero__btn hero__btn--primary">
              БАТЫРМА 1<span className="hero__btn-arrow">→</span>
            </button>
            <button className="hero__btn hero__btn--secondary">
              БАТЫРМА 2<span className="hero__btn-arrow">▷</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
