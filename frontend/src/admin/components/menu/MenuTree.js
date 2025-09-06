import React, { useState } from "react";

const MenuTree = ({ menuItems, onAddParent, onAddChild, onEdit, onDelete }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (menuItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <button
          onClick={onAddParent}
          className="flex flex-col items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Добавить первый пункт меню"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {menuItems.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems[item.id] !== false; // По умолчанию развернуто
          
          return (
            <div key={item.id} className="relative">
              {/* Родительский пункт */}
              <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  {/* Кнопка сворачивания/разворачивания */}
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="mr-3 p-1 bg-blue-500 hover:bg-blue-400 rounded text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                      title={isExpanded ? "Свернуть" : "Развернуть"}
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
                  <span className="text-lg font-medium">{item.label}</span>
                  {hasChildren && (
                    <span className="ml-2 text-sm text-blue-200">
                      ({item.children.length} подпункт{item.children.length !== 1 ? 'ов' : ''})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {/* Кнопка добавления подпункта */}
                  <button
                    onClick={() => onAddChild(item)}
                    className="p-1.5 bg-blue-500 hover:bg-blue-400 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                    title="Добавить подпункт"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  {/* Кнопка редактирования */}
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 bg-yellow-500 hover:bg-yellow-400 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    title="Редактировать"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {/* Кнопка удаления */}
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 bg-red-500 hover:bg-red-400 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Дочерние элементы */}
              {hasChildren && isExpanded && (
                <div className="ml-8 mt-4 space-y-2">
                  {item.children.map((child, childIndex) => (
                    <div key={child.id} className="relative">
                      {/* Вертикальная линия */}
                      <div className="absolute left-0 top-0 w-px h-full bg-blue-300"></div>
                      
                      {/* Подпункт */}
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg ml-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700">{child.label}</span>
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                            {getTypeLabel(child.type)}
                          </span>
                          {child.type === "link" && child.url && (
                            <span className="ml-2 text-xs text-gray-500 truncate max-w-xs">
                              {child.url}
                            </span>
                          )}
                          {child.type === "page" && child.pageSlug && (
                            <span className="ml-2 text-xs text-gray-500">
                              /{child.pageSlug}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {/* Кнопка редактирования */}
                          <button
                            onClick={() => onEdit(child)}
                            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
                            title="Редактировать"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {/* Кнопка удаления */}
                          <button
                            onClick={() => onDelete(child)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                            title="Удалить"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Кнопка добавления нового пункта снизу */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onAddParent}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Добавить новый пункт меню"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Вспомогательная функция для получения названия типа
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

export default MenuTree;
