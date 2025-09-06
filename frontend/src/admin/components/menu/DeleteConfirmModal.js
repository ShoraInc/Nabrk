import React, { useState } from "react";
import menuApi from "../../../api/menuApi";

const DeleteConfirmModal = ({ item, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasChildren = item.children && item.children.length > 0;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await menuApi.deleteMenuItem(item.id);
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

  const getTypeLabel = (type) => {
    switch (type) {
      case "title":
        return "Название";
      case "link":
        return "Ссылка";
      case "page":
        return "Страница";
      default:
        return "Название";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Заголовок */}
        <div className="mt-3">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mt-4">
            Подтверждение удаления
          </h3>
        </div>

        {/* Содержимое */}
        <div className="mt-4">
          {hasChildren ? (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Нельзя удалить пункт меню, который содержит подпункты.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Сначала удалите все подпункты
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        У пункта "{item.titleRu || item.titleKz || item.titleEn}" есть {item.children.length} подпункт(ов). 
                        Удалите их перед удалением основного пункта.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Вы уверены, что хотите удалить этот пункт меню?
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{item.titleRu || item.titleKz || item.titleEn}</p>
                  <p className="text-gray-500">
                    Тип: {getTypeLabel(item.type)}
                  </p>
                  {item.type === "link" && item.url && (
                    <p className="text-gray-500">URL: {item.url}</p>
                  )}
                  {item.type === "page" && item.pageSlug && (
                    <p className="text-gray-500">Slug: {item.pageSlug}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Кнопки */}
          <div className="mt-6 flex justify-center space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              {hasChildren ? "Понятно" : "Отмена"}
            </button>
            {!hasChildren && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Удаление..." : "Удалить"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
