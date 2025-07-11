import React, { useState } from "react";
import "./ForgetPassword.scss";
import LoginHeader from "../../../components/layout/LoginHeader/LoginHeader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { switchToLogin } from "../../../store/modalSlice";

const ForgetPassword = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      return;
    }

    setIsLoading(true);

    try {
      // Здесь будет логика отправки данных
      console.log("Password reset attempt:", formData);

      // Имитация запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // После успешной отправки можно перенаправить
      alert("Сілтеме электронды поштаңызға жіберілді!");
      onClose();
    } catch (error) {
      console.error("Reset error:", error);
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
              Құпия сөзді қалпына келтіру
            </h1>
            <p className="forget-password__description">
              Жаңа құпия сөз сіздің электронды поштаға жөберіледі
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
                Электронды пошта
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
                Оқырман билеті
              </button>
            </div>

            {/* Поле ввода */}
            <div className="forget-password__field">
              <label className="forget-password__label">
                {formData.loginMethod === "email"
                  ? "Электрондық пошта мекенжайы"
                  : "Оқырман билетінің нөмірі"}
                <input
                  type={formData.loginMethod === "email" ? "email" : "text"}
                  className="forget-password__input"
                  name="inputValue"
                  value={formData.inputValue}
                  onChange={handleInputChange}
                  placeholder={
                    formData.loginMethod === "email"
                      ? "yourmail@mail.com"
                      : "Оқырман нөміріңізді енгізіңіз"
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
              {isLoading ? "Сілтеме жіберу..." : "Сілтеме жіберу"}
            </button>
          </form>

          {/* Кнопка возврата к логину */}
          <div className="forget-password__back">
            <button
              className="forget-password__back-btn"
              onClick={handleBackToLogin}
              type="button"
            >
              ← Кіруге оралу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
