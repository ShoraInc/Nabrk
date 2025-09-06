import React, { useState, useEffect } from "react";
import menuApi from "../../../api/menuApi";

const AddMenuItemModal = ({ parentItem, onSuccess, onClose }) => {
  const [type, setType] = useState("title");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Сброс формы при изменении типа
  useEffect(() => {
    setUrl("");
    setPageSlug("");
    setError(null);
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Валидация
      if (!label.trim()) {
        throw new Error("Название обязательно");
      }

      if (type === "link" && !url.trim()) {
        throw new Error("URL обязателен для типа 'Ссылка'");
      }

      if (type === "link" && !menuApi.validateUrl(url)) {
        throw new Error("Введите корректный URL (начинающийся с http:// или https://)");
      }

      if (type === "page" && !pageSlug.trim()) {
        throw new Error("Slug страницы обязателен для типа 'Страница'");
      }

      // Подготовка данных
      const menuData = {
        parentId: parentItem ? parentItem.id : null,
        type,
        label: label.trim(),
      };

      if (type === "link") {
        menuData.url = url.trim();
      } else if (type === "page") {
        menuData.pageSlug = pageSlug.trim();
      }

      // Создание пункта меню
      await menuApi.createMenuItem(menuData);
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {parentItem ? "Добавить подпункт" : "Добавить главный пункт"}
          </h3>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit}>
          {/* Тип пункта */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип пункта
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

          {/* Название */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите название пункта"
              disabled={loading}
              required
            />
          </div>

          {/* URL (для типа "Ссылка") */}
          {type === "link" && (
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

          {/* Slug страницы (для типа "Страница") */}
          {type === "page" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug страницы *
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
                Введите slug страницы (например: about-us)
              </p>
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

export default AddMenuItemModal;
