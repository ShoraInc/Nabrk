import React from 'react';
import "./Administration.scss";

// Import icons
import AddressIcon from "../../assets/icons/AddressIcon.png";
import EmailIcon from "../../assets/icons/EmailIcon.png";
import PhoneIcon from "../../assets/icons/PhoneIcon.png";
import PrinterIcon from "../../assets/icons/Printer.png";
import UserIcon from "../../assets/icons/UserIcon.png";

export default function Administration() {
  return (
    <div className="administration">
      <div className="administration__container">
        <div className="administration__header">
          <h1 className="administration__title">Әкімшілік</h1>
          <div className="administration__divider"></div>
        </div>

        <div className="administration__content">
          {/* First Section */}
          <div className="administration__section">
            <h2 className="administration__subtitle">
              Қазақстан Республикасы Ұлттық<br />
              академиялық кітапханасы басшысы
            </h2>
            
            <div className="administration__card">
              <div className="administration__contact-item">
                <img src={UserIcon} alt="User" className="administration__icon" />
                <span className="administration__text">Нұрғалиева Ғазиза Құдайбергенқызы</span>
              </div>
              
              <div className="administration__contact-item">
                <img src={PhoneIcon} alt="Phone" className="administration__icon" />
                <a href="tel:+77172472545" className="administration__text">+7 (7172) 47 25 45</a>
              </div>
              
              <div className="administration__contact-item">
                <img src={PhoneIcon} alt="Phone" className="administration__icon" />
                <span className="administration__text">+7 (7172) 47 26 59 (қабылдау бөлімі)</span>
              </div>
              
              <div className="administration__contact-item">
                <img src={PrinterIcon} alt="Fax" className="administration__icon" />
                <span className="administration__text">+7 (7172) 47 26 69</span>
              </div>
              
              <div className="administration__contact-item">
                <img src={EmailIcon} alt="Email" className="administration__icon" />
                <a href="mailto:info@nabrk.kz" className="administration__text">info@nabrk.kz</a>
              </div>
            </div>
          </div>

          {/* Second Section */}
          <div className="administration__section">
            <h2 className="administration__subtitle">
              Пайдаланушыларға қызмет көрсету және<br />
              кітапхана ісі жөніндегі басшының орынбасары
            </h2>
            
            <div className="administration__card">
              <div className="administration__contact-item">
                <img src={UserIcon} alt="User" className="administration__icon" />
                <span className="administration__text">Қожабекова Алия Мамбайқызы</span>
              </div>
              
              <div className="administration__contact-item">
                <img src={PhoneIcon} alt="Phone" className="administration__icon" />
                <a href="tel:+77172472712" className="administration__text">+7 (7172) 47 27 12</a>
              </div>
              
              <div className="administration__contact-item">
                <img src={EmailIcon} alt="Email" className="administration__icon" />
                <a href="mailto:a.kozhabekova@nabrk.kz" className="administration__text">a.kozhabekova@nabrk.kz</a>
              </div>
            </div>
          </div>

          {/* Third Section */}
          <div className="administration__section">
            <h2 className="administration__subtitle">
              Ақпараттық ресурстар және жастар саясаты<br />
              жөніндегі басшының орынбасары
            </h2>
            
            <div className="administration__card">
              <div className="administration__contact-item">
                <img src={UserIcon} alt="User" className="administration__icon" />
                <span className="administration__text">Жолдыбалинов Нұржан Нұрланұлы</span>
              </div>
              
              <div className="administration__contact-item">
                <img src={PhoneIcon} alt="Phone" className="administration__icon" />
                <a href="tel:+77172472715" className="administration__text">+7 (7172) 47 27 15</a>
              </div>
              
              <div className="administration__contact-item">
                <img src={EmailIcon} alt="Email" className="administration__icon" />
                <a href="mailto:n.zholdybalinov@nabrk.kz" className="administration__text">n.zholdybalinov@nabrk.kz</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}