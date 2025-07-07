import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../store/modalSlice";
import "./home.scss";
import Events from "./components/Events/Events";
import News from "./components/News/News";
import LatestPublicationsPage from "./components/latestBookList/LatestPublicationsPage";
import FAQ from "./components/faq/faq";
import RegistrationForm from "../LoginPages/RegistrationForm/Registrationform";
import LoginForm from "../LoginPages/LoginForm/LoginForm";
import ForgetPassword from "../LoginPages/ForgetPassword/ForgetPassword";
import Hero from "./components/Hero/Hero";
import Search from "./components/Search/Search";
import LibraryServices from "./components/Services/LibraryServices";

export default function Home() {
  // Получаем текущее модальное окно
  const currentModal = useSelector((state) => state.modal.currentModal);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <div className="Home">
      <Hero />
      <Search />
      <LibraryServices />
      <Events />
      <News />
      <LatestPublicationsPage />
      <FAQ />

      {/* Модальные окна */}
      {currentModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Показываем окно регистрации */}
            {currentModal === "registration" && (
              <RegistrationForm onClose={handleCloseModal} />
            )}

            {/* Показываем окно входа */}
            {currentModal === "login" && (
              <LoginForm onClose={handleCloseModal} />
            )}

            {/* Показываем окно входа */}
            {currentModal === "forget" && (
              <ForgetPassword onClose={handleCloseModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
