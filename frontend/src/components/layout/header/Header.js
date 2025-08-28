// components/Header.js
import React from "react";
import "./Header.scss";
import LanguageSelector from "../../LanguageSelector/LanguageSelector";
import useMobileDetection from "../../../hooks/useMobileDetection";
import Logo from "../../../assets/logos/Logo.png";

const Header = () => {
  const isMobile = useMobileDetection();

  return (
    <header className="main-header">
      <div className="main-header__container">
        <div className="main-header__logo">
          <div className="main-header__logo-placeholder">
            <img src={Logo} alt="Logo" />
          </div>
        </div>

        <nav className="main-header__nav">
          <a href="/" className="main-header__nav-item">
            Главная
          </a>
          <a href="/book-search" className="main-header__nav-item">
            Поиск книг
          </a>
          <a href="/about" className="main-header__nav-item">
            О нас
          </a>
          <a href="/contact" className="main-header__nav-item">
            Контакты
          </a>
        </nav>
        <LanguageSelector isMobile={isMobile} />
      </div>
    </header>
  );
};

export default Header;
