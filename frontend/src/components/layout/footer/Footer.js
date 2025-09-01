import React from "react";
import "./Footer.scss";
import FooterLogo from "../../../assets/logos/Logo.png";
import UserIcon from "./assets/icons/User Icon.png";
import PhoneIcon from "./assets/icons/Phone Icon.png";
import EmailIcon from "./assets/icons/Email Icon.png";
import InstagramIcon from "./assets/icons/Instagram Icon.png";
import TwitterIcon from "./assets/icons/X Icon.png";
import YouTubeIcon from "./assets/icons/Youtube Icon.png";
import LocationIcon from "./assets/icons/Address Icon.png";
import { useTranslations } from "../../../hooks/useTranslations";

const Footer = () => {
  const { t } = useTranslations();
  
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Logo Section */}
          <div className="footer__logo">
            <div className="footer__logo-placeholder">
              <img
                src={FooterLogo}
                alt="Footer Logo"
                className="footer__logo-image"
              />
            </div>
          </div>

          {/* Navigation Section */}
          <div className="footer__section">
            <h3 className="footer__title">{t('footer.navigation').toUpperCase()}</h3>
            <ul className="footer__list">
              <li className="footer__item">
                <a href="/book-search" className="footer__link">
                  {t('services.bookCatalog.title')}
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link">
                  {t('services.digitalResources.title')}
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link">
                  {t('services.support.title')}
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link">
                  {t('services.news.title')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer__section">
            <h3 className="footer__title">{t('footer.pressSecretary').toUpperCase()}</h3>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <span className="footer__contact-icon">
                  <img
                    src={UserIcon}
                    alt="User Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <span className="footer__contact-text">
                  {t('footer.pressSecretaryName')}
                </span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">
                  <img
                    src={PhoneIcon}
                    alt="Phone Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <a href="tel:+77172472681" className="footer__contact-text">
                  +7 (7172) 47 26 81
                </a>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">
                  <img
                    src={EmailIcon}
                    alt="Email Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <a
                  href="mailto:uak_2022@mail.ru"
                  className="footer__contact-text"
                >
                  uak_2022@mail.ru
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="footer__section">
            <h3 className="footer__title">{t('footer.contact').toUpperCase()}</h3>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <span className="footer__contact-icon">
                  <img
                    src={LocationIcon}
                    alt="Location Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <span className="footer__contact-text">
                  {t('footer.address')}
                </span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">
                  <img
                    src={EmailIcon}
                    alt="Email Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <a href="mailto:info@nabrk.kz" className="footer__contact-text">
                  info@nabrk.kz
                </a>
              </div>
              <div className="footer__social">
                <span className="footer__social-icon">
                  <img
                    src={EmailIcon}
                    alt="Email Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <span className="footer__social-icon">
                  <img
                    src={InstagramIcon}
                    alt="Facebook Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <span className="footer__social-icon">
                  <img
                    src={TwitterIcon}
                    alt="Instagram Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
                <span className="footer__social-icon">
                  <img
                    src={YouTubeIcon}
                    alt="YouTube Icon"
                    className="footer__contact-icon-image"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
