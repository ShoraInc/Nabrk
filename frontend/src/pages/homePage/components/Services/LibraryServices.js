import React from 'react';
import './LibraryServices.scss';
import BookOpen from './assets/icons/BookOpen.svg';
import Laptop from './assets/icons/Laptop.svg';
import Newspaper from './assets/icons/Newspaper.svg';
import Question from './assets/icons/Question.svg';
import { useTranslations } from '../../../../hooks/useTranslations';
import { Link } from "react-router-dom";

const LibraryServices = () => {
  const { t } = useTranslations();

  return (
    <section className="library-services">
      <div className="library-services__container">

        {/* Электронды каталог */}
        <a href="/book-search" className="footer__link">

          <div className="service-card">

            <div className="service-card__icon">
              <img src={BookOpen} alt="Book Open" />
            </div>
            <h3 className="service-card__title">
              {t('services.bookCatalog.title')}
            </h3>
          </div>
        </a>

        {/* Электронды кітапхана */}
        <div className="service-card">
          <a href="https://kazneb.kz" target="_blank" rel="noopener noreferrer">
            <div className="service-card__icon">
              <img src={Laptop} alt="Laptop" />
            </div>
            <h3 className="service-card__title">
              {t('services.digitalResources.title')}
            </h3>
          </a>
        </div>

        {/* Кітапханашыға сұрақ */}
        <Link to="/questions" className="service-card__link">
          <div className="service-card">
            <div className="service-card__icon">
              <img src={Question} alt="Question" />
            </div>
            <h3 className="service-card__title">{t('services.support.title')}</h3>
          </div>
        </Link>

        {/* Басшының жеке блогы */}
        <Link to="/director-blog" className="service-card__link">
          <div className="service-card">
            <div className="service-card__icon">
              <img src={Newspaper} alt="Newspaper" />
            </div>
            <h3 className="service-card__title">{t('services.news.title')}</h3>
          </div>
        </Link>

      </div>
    </section>
  );
};

export default LibraryServices;