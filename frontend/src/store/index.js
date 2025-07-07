import { configureStore } from '@reduxjs/toolkit';
import modalSlice from './modalSlice';

// Создаем главный store
export const store = configureStore({
  reducer: {
    modal: modalSlice, // Пока только модальные окна
  },
});