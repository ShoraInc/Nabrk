import React from "react";
import { useDispatch } from "react-redux"; // Для отправки действий
import { openLoginModal } from "../../store/modalSlice"; // Импортируем действие
import "./Header.scss";

const Header = () => {
  // Создаем dispatch для отправки действий в store
  const dispatch = useDispatch();

  // Функция для открытия модального окна
  const handleOpenModal = () => {
    dispatch(openLoginModal()); // Отправляем действие openModal в store
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Логотип */}
        <div className="header__logo">
          <h2>Логотип</h2>
        </div>

        {/* Кнопка регистрации */}
        <div className="header__auth">
          <button
            className="header__register-btn"
            onClick={handleOpenModal} // При клике вызываем функцию
          >
            Кіру
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
