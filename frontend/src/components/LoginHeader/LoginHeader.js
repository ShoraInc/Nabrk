import React from "react";
import "./LoginHeader.scss";
import Logo from "../../assets/logos/Logo.png";

const LoginHeader = ({ onClose }) => {
  return (
    <div className="login-header">
      <div className="login-header__container">
        <div className="login-header__logo">
          <div className="login-header__logo-placeholder">
            <img src={Logo} alt="Logo" />
          </div>
        </div>

        <button className="login-header__close" onClick={onClose}>
          <span className="login-header__close-icon">×</span>
        </button>
      </div>

      <div className="login-header__progress">
      </div>
    </div>
  );
};

export default LoginHeader;
