// FAQ.jsx
import React, { useState } from "react";
import "./FAQ.scss";
import Plus from "./assets/icons/Plus.png";
import X from "./assets/icons/X.png";
import { useTranslations } from "../../../../hooks/useTranslations";

export default function FAQ() {
  const { t } = useTranslations();
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqItems = t('faq.questions').map((item, index) => ({
    title: item.question,
    content: item.answer
  }));

  return (
    <div className="faq">
      <div className="faq__container">
        {/* Header */}
        <div className="faq__header">
          <h2 className="faq__title">{t('faq.title')}</h2>
          <button className="view-all-btn">{t('events.viewAll')}</button>
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
