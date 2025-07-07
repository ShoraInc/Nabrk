import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние
const initialState = {
  currentModal: null, // null | 'registration' | 'login'
};

// Создаем slice
const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // Открыть модальное окно регистрации
    openRegistrationModal: (state) => {
      state.currentModal = "registration";
      document.body.classList.add("no-scroll");
    },

    // Открыть модальное окно входа
    openLoginModal: (state) => {
      state.currentModal = "login";
      document.body.classList.add("no-scroll");
    },

    // Закрыть любое модальное окно
    closeModal: (state) => {
      state.currentModal = null;
      document.body.classList.remove("no-scroll");
    },

    // Переключиться с регистрации на вход
    switchToLogin: (state) => {
      state.currentModal = "login";
      // Прокрутка уже заблокирована, не трогаем
    },

    // Переключиться с входа на регистрацию
    switchToRegistration: (state) => {
      state.currentModal = "registration";
      // Прокрутка уже заблокирована, не трогаем
    },
    switchToForgetPassword: (state) => {
      state.currentModal = "forget";
    }
  },
});

// Экспортируем действия
export const {
  openRegistrationModal,
  openLoginModal,
  closeModal,
  switchToLogin,
  switchToRegistration,
  switchToForgetPassword
} = modalSlice.actions;

// Экспортируем reducer
export default modalSlice.reducer;
