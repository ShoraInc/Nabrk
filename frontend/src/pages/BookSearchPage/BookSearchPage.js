import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './BookSearchPage.scss';
import SearchForm from './components/SearchForm/SearchForm';
import SearchResults from './components/SearchResults/SearchResults';
import AdvancedSearchForm from './components/AdvancedSearchForm/AdvancedSearchForm';
import SearchSidebar from './components/SearchSidebar/SearchSidebar';
import { BookSearchApi } from '../../api/bookSearchApi';
import {
  setSearchResults,
  setLastSearchParams,
  setActiveTab,
  setLoading,
  setError,
  selectSearchResults,
  selectLastSearchParams,
  selectActiveTab,
  selectSearchStats,
  selectRefinementItems,
  selectLoading,
  selectError
} from '../../store/bookSearchSlice';

export default function BookSearchPage() {
  const dispatch = useDispatch();
  const [appliedFilters, setAppliedFilters] = useState({});
  
  // Получаем данные из Redux
  const results = useSelector(selectSearchResults);
  const loading = useSelector(selectLoading);
  const searchStats = useSelector(selectSearchStats);
  const refinementItems = useSelector(selectRefinementItems);
  const activeTab = useSelector(selectActiveTab);
  const error = useSelector(selectError);
  const lastSearchParams = useSelector(selectLastSearchParams);

  const handleSearch = async (searchData) => {
    // Проверяем, есть ли данные для поиска
    if (searchData.searchItems && searchData.searchItems.length > 0) {
      const hasValidSearch = searchData.searchItems.some(item => item.value && item.value.trim());
      if (!hasValidSearch) return;
    } else if (searchData.searchText) {
      if (!searchData.searchText.trim()) return;
    } else if (searchData.fullTextSearchText) {
      if (!searchData.fullTextSearchText.trim()) return;
    } else {
      return; // Нет данных для поиска
    }

    dispatch(setLoading(true));
    dispatch(setLastSearchParams(searchData));
    
    try {
      const response = await BookSearchApi.search(searchData);
      console.log('Search response:', response);
      dispatch(setSearchResults({
        results: response.BRList || [],
        stats: {
          totalResults: response.ResultSize || 0,
          searchTime: Date.now(),
          query: JSON.stringify(searchData)
        },
        refinementItems: response.RefinementItems || null
      }));
    } catch (error) {
      console.error('Search error:', error);
      dispatch(setError('Поиск не удался'));
    }
  };

  const handleAdvancedSearch = async (searchData) => {
    dispatch(setLoading(true));
    dispatch(setLastSearchParams(searchData));
    
    try {
      const response = await BookSearchApi.search(searchData);
      console.log('Search response:', response);
      dispatch(setSearchResults({
        results: response.BRList || [],
        stats: {
          totalResults: response.ResultSize || 0,
          searchTime: Date.now(),
          query: JSON.stringify(searchData)
        },
        refinementItems: response.RefinementItems || null
      }));
    } catch (error) {
      console.error('Advanced search error:', error);
      dispatch(setError('Расширенный поиск не удался'));
    }
  };

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  // Функция для создания поискового запроса с фильтрами
  const buildSearchDataWithFilters = (baseSearchData, filters) => {
    const searchData = { ...baseSearchData };
    const filterItems = [];
    
    // Добавляем фильтры как дополнительные searchItems
    Object.entries(filters).forEach(([filterType, values]) => {
      values.forEach(value => {
        filterItems.push({
          field: filterType,
          operator: 'AND',
          value: value
        });
      });
    });
    
    // Объединяем исходные searchItems с фильтрами
    const originalItems = searchData.searchItems || [];
    searchData.searchItems = [...originalItems, ...filterItems];
    
    return searchData;
  };

  // Функция для повторного поиска с фильтрами
  const reapplySearchWithFilters = useCallback(async (newFilters) => {
    if (!lastSearchParams) return;
    
    const searchDataWithFilters = buildSearchDataWithFilters(lastSearchParams, newFilters);
    console.log('Reapplying search with filters:', searchDataWithFilters);
    
    dispatch(setLoading(true));
    
    try {
      const response = await BookSearchApi.search(searchDataWithFilters);
      console.log('Filtered search response:', response);
      dispatch(setSearchResults({
        results: response.BRList || [],
        stats: {
          totalResults: response.ResultSize || 0,
          searchTime: Date.now(),
          query: JSON.stringify(searchDataWithFilters)
        },
        refinementItems: response.RefinementItems || null
      }));
    } catch (error) {
      console.error('Filtered search error:', error);
      dispatch(setError('Фильтрация не удалась'));
    }
  }, [lastSearchParams, dispatch]);

  const handleFilterChange = (filterType, value, checked) => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[filterType]) {
        newFilters[filterType] = [];
      }
      
      if (checked) {
        if (!newFilters[filterType].includes(value)) {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = newFilters[filterType].filter(v => v !== value);
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType];
        }
      }
      
      return newFilters;
    });
    
    console.log('Filter changed:', { filterType, value, checked });
  };

  // Применяем фильтры при их изменении
  useEffect(() => {
    if (Object.keys(appliedFilters).length > 0) {
      reapplySearchWithFilters(appliedFilters);
    }
  }, [appliedFilters, reapplySearchWithFilters]);

  // Восстанавливаем состояние при загрузке страницы
  useEffect(() => {
    // Если есть сохраненные параметры поиска, можно их использовать
    if (lastSearchParams && results.length > 0) {
      console.log('Восстановлено состояние поиска:', {
        results: results.length,
        lastSearchParams,
        activeTab
      });
    }
  }, [lastSearchParams, results.length, activeTab]);

  return (
    <div className="book-search-page">
      
      
      <main className="container mx-auto px-4 py-8">
        {/* Табы поиска */}
        <div className="book-search-page__tabs">
          <button
            className={`book-search-page__tab ${activeTab === 'SIMPLE' ? 'book-search-page__tab--active' : ''}`}
            onClick={() => handleTabChange('SIMPLE')}
          >
            Іздеу
          </button>
          <button
            className={`book-search-page__tab ${activeTab === 'ADVANCED' ? 'book-search-page__tab--active' : ''}`}
            onClick={() => handleTabChange('ADVANCED')}
          >
            Кеңейтілген іздеу
          </button>
          <button
            className={`book-search-page__tab ${activeTab === 'FULLTEXT' ? 'book-search-page__tab--active' : ''}`}
            onClick={() => handleTabChange('FULLTEXT')}
          >
            Толық мәтіндік іздеу
          </button>
          <button
            className={`book-search-page__tab ${activeTab === 'UDC' ? 'book-search-page__tab--active' : ''}`}
            onClick={() => handleTabChange('UDC')}
          >
            ӘОЖ бойынша іздеу
          </button>
        </div>

        {/* Форма поиска в зависимости от активного таба */}
        <div className="book-search-page__search-area">
          {activeTab === 'SIMPLE' && (
            <SearchForm 
              onSearch={handleSearch} 
              loading={loading} 
            />
          )}
          
          {activeTab === 'ADVANCED' && (
            <AdvancedSearchForm 
              onSearch={handleAdvancedSearch} 
              loading={loading} 
            />
          )}
          
          {activeTab === 'FULLTEXT' && (
            <SearchForm 
              onSearch={handleSearch} 
              loading={loading} 
              searchType="FULLTEXT"
            />
          )}
          
          {activeTab === 'UDC' && (
            <SearchForm 
              onSearch={handleSearch} 
              loading={loading} 
              searchType="UDC"
            />
          )}
        </div>
        
        {/* Ошибки */}
        {error && (
          <div className="mt-8" style={{ maxWidth: '1200px', margin: '2rem auto 0' }}>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Результаты поиска с сайдбаром */}
        {results.length > 0 && (
          <div className="book-search-page__results-container">
            <div className="book-search-page__results-sidebar">
              <SearchSidebar 
                filters={appliedFilters}
                onFilterChange={handleFilterChange}
                refinementItems={refinementItems}
              />
            </div>
            <div className="book-search-page__results-main">
              <SearchResults 
                results={results} 
                loading={loading} 
                searchStats={searchStats}
              />
            </div>
          </div>
        )}
      </main>
      
      
    </div>
  );
}
