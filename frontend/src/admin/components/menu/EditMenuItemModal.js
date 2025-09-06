import React, { useState, useEffect, useRef } from "react";
import menuApi from "../../../api/menuApi";
import pagesApi from "../../../api/pagesApi";

const EditMenuItemModal = ({ item, onSuccess, onClose }) => {
  const [type, setType] = useState(item.type);
  const [titleKz, setTitleKz] = useState(item.titleKz || "");
  const [titleRu, setTitleRu] = useState(item.titleRu || "");
  const [titleEn, setTitleEn] = useState(item.titleEn || "");
  const [url, setUrl] = useState(item.url || "");
  const [pageSlug, setPageSlug] = useState(item.pageSlug || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Состояние для поиска страниц (только для подпунктов)
  const [searchQuery, setSearchQuery] = useState(item.pageSlug ? "" : "");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allPages, setAllPages] = useState([]);

  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Загрузка всех страниц при открытии модального окна
  useEffect(() => {
    const loadAllPages = async () => {
      try {
        const pages = await pagesApi.getAllPagesAdmin();
        setAllPages(pages);
        // Если это страница, показываем все страницы
        if (item.type === "page") {
          setSearchResults(pages.slice(0, 5));
          setShowSearchResults(true);
        }
      } catch (err) {
        console.error("Ошибка загрузки страниц:", err);
        setError("Ошибка загрузки страниц");
      }
    };

    loadAllPages();
  }, [item.type]);

  // Функция для принудительной загрузки страниц
  const loadPages = async () => {
    try {
      setSearchLoading(true);
      const pages = await pagesApi.getAllPagesAdmin();
      setAllPages(pages);
      setSearchResults(pages.slice(0, 5));
      setShowSearchResults(true);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки страниц:", err);
      setError("Ошибка загрузки страниц");
    } finally {
      setSearchLoading(false);
    }
  };

  // Сброс полей при изменении типа (только для подпунктов)
  useEffect(() => {
    if (item.parentId) {
      if (type !== "link") {
        setUrl("");
      }
      if (type !== "page") {
        setPageSlug("");
        setSearchQuery("");
        setSelectedPage(null);
      }
    }
    setError(null);
  }, [type, item.parentId]);

  // Поиск страниц с задержкой
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      // Показываем все страницы если поиск пустой
      setSearchResults(allPages.slice(0, 5));
    } else {
      // Фильтруем локально по названию и slug
      const filtered = allPages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 10)); // Показываем больше результатов при поиске
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, allPages]);

  // Обработка выбора страницы
  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setPageSlug(page.slug);
    setSearchQuery(page.title);
    setShowSearchResults(false);
  };

  // Обработка клика вне области поиска
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Валидация
      if (!titleKz.trim() || !titleRu.trim() || !titleEn.trim()) {
        throw new Error("Названия на всех языках обязательны");
      }

      // Дополнительная валидация только для подпунктов
      if (item.parentId) {
        if (type === "link" && !url.trim()) {
          throw new Error("URL обязателен для типа 'Ссылка'");
        }

        if (type === "link" && !menuApi.validateUrl(url)) {
          throw new Error("Введите корректный URL (начинающийся с http:// или https://)");
        }

        if (type === "page" && !pageSlug.trim()) {
          throw new Error("Slug страницы обязателен для типа 'Страница'");
        }
      }

      // Подготовка данных
      const updateData = {
        titleKz: titleKz.trim(),
        titleRu: titleRu.trim(),
        titleEn: titleEn.trim(),
      };

      // Для подпунктов добавляем тип и соответствующие поля
      if (item.parentId) {
        updateData.type = type;
        
        if (type === "link") {
          updateData.url = url.trim();
          updateData.pageSlug = null;
        } else if (type === "page") {
          updateData.pageSlug = pageSlug.trim();
          updateData.url = null;
        } else if (type === "title") {
          updateData.url = null;
          updateData.pageSlug = null;
        }
      } else {
        // Для родительских пунктов тип всегда "title"
        updateData.type = "title";
        updateData.url = null;
        updateData.pageSlug = null;
      }

      // Обновление пункта меню
      await menuApi.updateMenuItem(item.id, updateData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Заголовок */}
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {item.parentId ? "Редактировать подпункт" : "Редактировать главный пункт"}
          </h3>
          {item.parentId && (
            <p className="text-sm text-gray-500 mb-4">
              Родительский пункт: <span className="font-medium">{item.parent?.titleRu || item.parent?.titleKz || item.parent?.titleEn || "Неизвестно"}</span>
            </p>
          )}
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit}>
          {/* Тип пункта (только для подпунктов) */}
          {item.parentId && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип подпункта
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="title">Название</option>
                <option value="link">Ссылка</option>
                <option value="page">Страница</option>
              </select>
            </div>
          )}

          {/* Название на казахском */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название (казахский) *
            </label>
            <input
              type="text"
              value={titleKz}
              onChange={(e) => setTitleKz(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите название на казахском"
              disabled={loading}
              required
            />
          </div>

          {/* Название на русском */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название (русский) *
            </label>
            <input
              type="text"
              value={titleRu}
              onChange={(e) => setTitleRu(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите название на русском"
              disabled={loading}
              required
            />
          </div>

          {/* Название на английском */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название (английский) *
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите название на английском"
              disabled={loading}
              required
            />
          </div>

          {/* URL (для типа "Ссылка" и только для подпунктов) */}
          {item.parentId && type === "link" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
                disabled={loading}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Введите полный URL, начинающийся с http:// или https://
              </p>
            </div>
          )}

          {/* Поиск страниц (для типа "Страница" и только для подпунктов) */}
          {item.parentId && type === "page" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выбор страницы *
              </label>
              
              {/* Поле поиска и кнопка загрузки */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1" ref={searchInputRef}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Поиск страниц по названию или slug..."
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  onClick={loadPages}
                  disabled={searchLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Загрузить"
                  )}
                </button>
              </div>

              {/* Список страниц */}
              <div className="border border-gray-200 rounded-md bg-white">
                {/* Заголовок с количеством */}
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
                  {searchResults.length > 0 
                    ? `Найдено страниц: ${searchResults.length}${allPages.length > searchResults.length ? ` (из ${allPages.length})` : ''}`
                    : 'Страницы не найдены'
                  }
                </div>
                
                <div className="max-h-48 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => handlePageSelect(page)}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 ${
                          selectedPage?.id === page.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-medium text-sm text-gray-900">{page.title}</div>
                        <div className="text-xs text-gray-500">/{page.slug}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {searchLoading ? "Загрузка..." : "Нажмите 'Загрузить' для получения списка страниц"}
                    </div>
                  )}
                </div>
              </div>

              {/* Поле для slug */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Маршрут (slug)
                </label>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="about-us"
                  disabled={loading}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Введите slug страницы или выберите из списка выше
                </p>
              </div>

              {/* Выбранная страница */}
              {selectedPage && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-green-800">Выбрана: {selectedPage.title}</div>
                      <div className="text-xs text-green-600">Slug: /{selectedPage.slug}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
