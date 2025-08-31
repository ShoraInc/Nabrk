import { createSlice } from "@reduxjs/toolkit";

// Функция для загрузки состояния из localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('bookSearchState');
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return null;
  }
};

// Функция для сохранения состояния в localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('bookSearchState', serializedState);
  } catch (err) {
    // Игнорируем ошибки сохранения
  }
};

// Начальное состояние
const initialState = loadState() || {
  // Результаты поиска
  results: [],
  
  // Параметры последнего поиска
  lastSearchParams: null,
  
  // Активная вкладка
  activeTab: 'SIMPLE', // SIMPLE, ADVANCED, FULLTEXT, UDC
  
  // Статистика поиска
  searchStats: {
    totalResults: 0,
    searchTime: 0,
    query: ''
  },
  
  // Данные для фильтров (RefinementItems)
  refinementItems: null,
  
  // Состояние загрузки
  loading: false,
  
  // Ошибки
  error: null,
  
  // Фильтры расширенного поиска
  advancedFilters: {
    yearFrom: '1800',
    yearTo: '2025',
    language: '000',
    format: 'all',
    resultsLimit: '10'
  },
  
  // Элементы расширенного поиска
  advancedSearchItems: [
    { field: 'all', operator: 'AND', value: '' }
  ]
};

// Создаем slice
const bookSearchSlice = createSlice({
  name: "bookSearch",
  initialState,
  reducers: {
    // Установить результаты поиска
    setSearchResults: (state, action) => {
      state.results = action.payload.results || [];
      state.searchStats = action.payload.stats || state.searchStats;
      state.refinementItems = action.payload.refinementItems || null;
      state.loading = false;
      state.error = null;
    },
    
    // Установить параметры поиска
    setLastSearchParams: (state, action) => {
      state.lastSearchParams = action.payload;
    },
    
    // Установить активную вкладку
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // Установить состояние загрузки
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    // Установить ошибку
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Очистить результаты
    clearResults: (state) => {
      state.results = [];
      state.searchStats = {
        totalResults: 0,
        searchTime: 0,
        query: ''
      };
      state.error = null;
    },
    
    // Установить фильтры расширенного поиска
    setAdvancedFilters: (state, action) => {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    
    // Установить элементы расширенного поиска
    setAdvancedSearchItems: (state, action) => {
      state.advancedSearchItems = action.payload;
    },
    
    // Добавить элемент расширенного поиска
    addAdvancedSearchItem: (state) => {
      state.advancedSearchItems.push({ field: 'all', operator: 'AND', value: '' });
    },
    
    // Удалить элемент расширенного поиска
    removeAdvancedSearchItem: (state, action) => {
      const index = action.payload;
      if (state.advancedSearchItems.length > 1) {
        state.advancedSearchItems.splice(index, 1);
      }
    },
    
    // Обновить элемент расширенного поиска
    updateAdvancedSearchItem: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.advancedSearchItems[index]) {
        state.advancedSearchItems[index][field] = value;
      }
    },
    
    // Полный сброс состояния
    resetBookSearch: (state) => {
      return initialState;
    }
  },
});

// Экспортируем действия
export const {
  setSearchResults,
  setLastSearchParams,
  setActiveTab,
  setLoading,
  setError,
  clearResults,
  setAdvancedFilters,
  setAdvancedSearchItems,
  addAdvancedSearchItem,
  removeAdvancedSearchItem,
  updateAdvancedSearchItem,
  resetBookSearch
} = bookSearchSlice.actions;

// Селекторы
export const selectSearchResults = (state) => state.bookSearch.results;
export const selectLastSearchParams = (state) => state.bookSearch.lastSearchParams;
export const selectActiveTab = (state) => state.bookSearch.activeTab;
export const selectSearchStats = (state) => state.bookSearch.searchStats;
export const selectRefinementItems = (state) => state.bookSearch.refinementItems;
export const selectLoading = (state) => state.bookSearch.loading;
export const selectError = (state) => state.bookSearch.error;
export const selectAdvancedFilters = (state) => state.bookSearch.advancedFilters;
export const selectAdvancedSearchItems = (state) => state.bookSearch.advancedSearchItems;

// Экспортируем reducer
export default bookSearchSlice.reducer;

// Middleware для автоматического сохранения состояния
export const bookSearchMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Сохраняем состояние после каждого действия
  if (action.type.startsWith('bookSearch/')) {
    const state = store.getState().bookSearch;
    saveState(state);
  }
  
  return result;
};
