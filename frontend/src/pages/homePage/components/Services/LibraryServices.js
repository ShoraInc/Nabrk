import React from 'react';
import './LibraryServices.scss';
import BookOpen from './assets/icons/BookOpen.svg';
import Laptop from './assets/icons/Laptop.svg';
import Newspaper from './assets/icons/Newspaper.svg';
import Question from './assets/icons/Question.svg';

const LibraryServices = () => {
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
              Электронды каталог
            </h3>
          </div>
        </a>

        {/* Электронды кітапхана */}
        <div className="service-card">
          <div className="service-card__icon">
            <img src={Laptop} alt="Laptop" />
          </div>
          <h3 className="service-card__title">Электронды кітапхана</h3>
        </div>

        {/* Кітапханашыға сұрақ */}
        <div className="service-card">
          <div className="service-card__icon">
            <img src={Question} alt="Question" />
          </div>
          <h3 className="service-card__title">Кітапханашыға сұрақ</h3>
        </div>

        {/* Басшының жеке блогы */}
        <div className="service-card">
          <div className="service-card__icon">
            <img src={Newspaper} alt="Newspaper" />
          </div>
          <h3 className="service-card__title">Басшының жеке блогы</h3>
        </div>

      </div>
    </section>
  );
};

export default LibraryServices;