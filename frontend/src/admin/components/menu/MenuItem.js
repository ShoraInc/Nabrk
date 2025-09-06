import React, { useState } from "react";

const MenuItem = ({ item, onAddChild, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getTypeIcon = (type) => {
    switch (type) {
      case "title":
        return "📝";
      case "link":
        return "🔗";
      case "page":
        return "📄";
      default:
        return "📝";
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

  const getDisplayValue = (item) => {
    switch (item.type) {
      case "link":
        return item.url || "Не указан URL";
      case "page":
        return item.pageSlug || "Не указан slug";
      default:
        return item.label;
    }
  };

  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="bg-white">
      {/* Основной пункт */}
      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            {/* Кнопка разворачивания/сворачивания */}
            {hasChildren && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-3 p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Иконка типа */}
            <span className="text-lg mr-3">{getTypeIcon(item.type)}</span>

            {/* Информация о пункте */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.label}
                </p>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getTypeLabel(item.type)}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-500 truncate">
                  {getDisplayValue(item)}
                </p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Кнопка добавления дочернего элемента */}
            <button
              onClick={() => onAddChild(item)}
              className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              title="Добавить подпункт"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Кнопка редактирования */}
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-gray-400 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-md"
              title="Редактировать"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Кнопка удаления */}
            <button
              onClick={() => onDelete(item)}
              className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
              title="Удалить"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Дочерние элементы */}
      {hasChildren && isExpanded && (
        <div className="border-l-2 border-gray-200 ml-8">
          <ul className="divide-y divide-gray-100">
            {item.children.map((child) => (
              <li key={child.id} className="bg-gray-50">
                <div className="px-4 py-3 sm:px-6 hover:bg-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      {/* Иконка типа */}
                      <span className="text-sm mr-3">{getTypeIcon(child.type)}</span>

                      {/* Информация о дочернем пункте */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {child.label}
                          </p>
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                            {getTypeLabel(child.type)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-gray-500 truncate">
                            {getDisplayValue(child)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Кнопки действий для дочернего элемента */}
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Кнопка редактирования */}
                      <button
                        onClick={() => onEdit(child)}
                        className="p-1.5 text-gray-400 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-md"
                        title="Редактировать"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Кнопка удаления */}
                      <button
                        onClick={() => onDelete(child)}
                        className="p-1.5 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                        title="Удалить"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default MenuItem;
