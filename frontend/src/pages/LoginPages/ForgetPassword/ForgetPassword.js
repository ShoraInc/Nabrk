import React, { useState } from "react";
import "./ForgetPassword.scss";
import LoginHeader from "../../../components/layout/LoginHeader/LoginHeader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { switchToLogin } from "../../../store/modalSlice";
import AuthApi from "../../../api/authApi";
import { useTranslations } from "../../../hooks/useTranslations";

const ForgetPassword = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslations();

  const [formData, setFormData] = useState({
    inputValue: "",
    loginMethod: "email", // 'email' or 'student'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, inputValue: value }));
  };

  const handleMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      loginMethod: method,
      inputValue: "", // Очищаем поле при смене метода
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.inputValue.trim()) {
      alert(t('auth.forgotPassword.fillRequired'));
      return;
    }

    setIsLoading(true);

    try {
      console.log("Password recovery attempt:", formData);

      // Отправка на сервер
      const response = await AuthApi.passwordRecovery(formData.inputValue);
      
      console.log("Password recovery response:", response);
      
      alert(t('auth.forgotPassword.success'));
      onClose();
    } catch (error) {
      console.error("Reset error:", error);
      alert(`${t('auth.forgotPassword.error')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    dispatch(switchToLogin());
  };

  return (
    <div className="forget-password">
      <LoginHeader onClose={onClose} />

      <div className="forget-password__container">
        <div className="forget-password__content">
          <div className="forget-password__header">
            <h1 className="forget-password__title">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className="forget-password__description">
              {t('auth.forgotPassword.description')}
            </p>
          </div>

          <form className="forget-password__form" onSubmit={handleSubmit}>
            {/* Переключатель методов входа */}
            <div className="forget-password__method-switcher">
              <button
                type="button"
                className={`forget-password__method-button ${
                  formData.loginMethod === "email"
                    ? "forget-password__method-button--active"
                    : ""
                }`}
                onClick={() => handleMethodChange("email")}
              >
                {t('auth.forgotPassword.emailMethod')}
              </button>
              <button
                type="button"
                className={`forget-password__method-button ${
                  formData.loginMethod === "student"
                    ? "forget-password__method-button--active"
                    : ""
                }`}
                onClick={() => handleMethodChange("student")}
              >
                {t('auth.forgotPassword.studentMethod')}
              </button>
            </div>

            {/* Поле ввода */}
            <div className="forget-password__field">
              <label className="forget-password__label">
                {formData.loginMethod === "email"
                  ? t('auth.forgotPassword.emailAddress')
                  : t('auth.forgotPassword.readerCardNumber')}
                <input
                  type={formData.loginMethod === "email" ? "email" : "text"}
                  className="forget-password__input"
                  name="inputValue"
                  value={formData.inputValue}
                  onChange={handleInputChange}
                  placeholder={
                    formData.loginMethod === "email"
                      ? t('auth.forgotPassword.emailPlaceholder')
                      : t('auth.forgotPassword.readerPlaceholder')
                  }
                  required
                  disabled={isLoading}
                />
              </label>
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              className="forget-password__submit"
              disabled={!formData.inputValue.trim() || isLoading}
            >
              {isLoading ? t('auth.forgotPassword.loading') : t('auth.forgotPassword.submit')}
            </button>
          </form>

          {/* Кнопка возврата к логину */}
          <div className="forget-password__back">
            <button
              className="forget-password__back-btn"
              onClick={handleBackToLogin}
              type="button"
            >
              {t('auth.forgotPassword.backToLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
