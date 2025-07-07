// FAQ.jsx
import React, { useState } from "react";
import "./FAQ.scss";
import Plus from "./assets/icons/Plus.png";
import X from "./assets/icons/X.png";

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqItems = [
    {
      title: "Кітапханаға қалай тіркелуге болады?",
      content:
        "Кітапханаға тіркелу үшін жеке куәлігіңізбен келіп, тіркеу бөлімінде анкета толтырасыз. Процесс 5-10 минут алады.",
    },
    {
      title: "Кітаптарды қанша уақытқа алуға болады?",
      content:
        "Әдеби кітаптарды 15 күнге, оқу әдебиеттерін 30 күнге алуға болады. Қажет болса, мерзімді ұзартуға мүмкіндік бар.",
    },
    {
      title: "Электронды кітаптар қолжетімді ме?",
      content:
        "Иә, біздің электронды кітапхана базасында 10 000-нан астам кітап бар. Тіркелген оқырмандар логин/пароль арқылы кіре алады.",
    },
    {
      title: "Кітапханада Wi-Fi бар ма?",
      content:
        "Иә, барлық оқу залдарында тегін Wi-Fi қолжетімді. Пароль тіркеу бөлімінен алуға болады.",
    },
    {
      title: "Топтық сабақтарға зал брондауға бола ма?",
      content:
        "Әрине! Конференц-зал мен топтық жұмыс бөлмелерін алдын ала брондауға болады. +7 (XXX) XXX-XX-XX телефоны арқылы хабарласыңыз.",
    },
  ];

  return (
    <div className="faq">
      <div className="faq__container">
        {/* Header */}
        <div className="faq__header">
          <h2 className="faq__title">Жиі қойылатын сұрақтар</h2>
          <button className="view-all-btn">БАРЛЫҒЫ</button>
        </div>

        {/* FAQ Items */}
        <div className="faq__list">
          {faqItems.map((item, index) => (
            <div key={index} className="faq__item">
              <button onClick={() => toggleItem(index)} className="faq__button">
                <span className="faq__question">{item.title}</span>
                <div className="faq__icon-wrapper">
                  <img
                    src={Plus}
                    alt="Expand"
                    className={`faq__icon faq__icon--plus ${
                      openItems[index] ? "faq__icon--hidden" : ""
                    }`}
                  />
                  <img
                    src={X}
                    alt="Collapse"
                    className={`faq__icon faq__icon--x ${
                      openItems[index] ? "faq__icon--visible" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`faq__answer ${
                  openItems[index] ? "faq__answer--open" : ""
                }`}
              >
                <p className="faq__content">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="mobile-view-all-btn">БАРЛЫҒЫ</button>
      </div>
    </div>
  );
}
