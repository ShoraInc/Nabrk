import { configureStore } from '@reduxjs/toolkit';
import modalSlice from './modalSlice';
import bookSearchSlice, { bookSearchMiddleware } from './bookSearchSlice';

// Создаем главный store
export const store = configureStore({
  reducer: {
    modal: modalSlice,
    bookSearch: bookSearchSlice, // Добавляем поиск книг
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bookSearchMiddleware),
});