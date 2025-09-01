// components/Header.js
import React from "react";
import "./Header.scss";
import LanguageSelector from "../../LanguageSelector/LanguageSelector";
import useMobileDetection from "../../../hooks/useMobileDetection";
import Logo from "../../../assets/logos/Logo.png";
import { useTranslations } from "../../../hooks/useTranslations";

const Header = () => {
  const isMobile = useMobileDetection();
  const { t } = useTranslations();

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
            {t('header.home')}
          </a>
          <a href="/book-search" className="main-header__nav-item">
            {t('header.bookSearch')}
          </a>
          <a href="/about" className="main-header__nav-item">
            {t('header.aboutUs')}
          </a>
          <a href="/contact" className="main-header__nav-item">
            {t('header.contacts')}
          </a>
        </nav>
        <LanguageSelector isMobile={isMobile} />
      </div>
    </header>
  );
};

export default Header;
