import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "news",
      label: "Новости",
      icon: "📰",
      path: "/admin/news",
      subItems: [
        { id: "all-news", label: "Все новости", path: "/admin/news" },
        { id: "drafts", label: "Черновики", path: "/admin/news/drafts" },
        { id: "create", label: "Создать", path: "/admin/news/create" },
      ],
    },
    {
      id: "events",
      label: "События",
      icon: "📅",
      path: "/admin/events",
      subItems: [
        { id: "all-events", label: "Все события", path: "/admin/events" },
        {
          id: "event-drafts",
          label: "Черновики",
          path: "/admin/events/drafts",
        },
        { id: "create-event", label: "Создать", path: "/admin/events/create" },
      ],
    },
    {
      id: "pages",
      label: "Страницы",
      icon: "📄",
      path: "/admin/pages",
      subItems: [
        { id: "all-pages", label: "Все страницы", path: "/admin/pages" },
        { id: "page-drafts", label: "Черновики", path: "/admin/pages/drafts" },
        { id: "create-page", label: "Создать", path: "/admin/pages/create" },
      ],
    },
    {
      id: "qa",
      label: "Вопросы/Ответы",
      icon: "❓",
      path: "/admin/questions",
      subItems: [
        { id: "all-questions", label: "Все вопросы", path: "/admin/questions" },
        { id: "answers-drafts", label: "Черновики", path: "/admin/answers/drafts" },
        { id: "answers", label: "Все ответы", path: "/admin/answers" },
        { id: "types", label: "Типы ответов", path: "/admin/types" },
      ],
    },
  ];

  // track open/closed sections (initialize from localStorage synchronously to avoid flash)
  const [openSections, setOpenSections] = useState(() => {
    const state = {};
    menuItems.forEach((m) => { state[m.id] = true; });
    try {
      const saved = localStorage.getItem('adminSidebarOpen');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...state, ...parsed };
        }
      }
    } catch {}
    return state;
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    try {
      localStorage.setItem('adminSidebarOpen', JSON.stringify(openSections));
    } catch {}
  }, [openSections]);

  // preserve scroll position within sidebar
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    try {
      const saved = Number(localStorage.getItem('adminSidebarScrollTop') || 0);
      if (!Number.isNaN(saved)) {
        el.scrollTop = saved;
      }
    } catch {}

    const onScroll = () => {
      try {
        localStorage.setItem('adminSidebarScrollTop', String(el.scrollTop));
      } catch {}
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) onToggle(newState);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileToggle}
        className="fixed top-4 left-4 lg:hidden z-50 p-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Toggle Button */}
      <button
        onClick={handleToggle}
        className="hidden lg:flex fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300"
        style={{
          left: isExpanded ? "260px" : "68px",
          transform: "translateX(-50%)",
        }}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-40 flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isExpanded ? "w-64" : "w-16"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
          {isExpanded ? (
            <h1 className="font-bold text-xl">Админка</h1>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
          )}
        </div>

        {/* Menu Items - scrollable area */}
        <nav ref={scrollRef} className="mt-4 flex-1 overflow-y-auto pb-24 pr-1">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-2">
              {/* Main menu item */}
              <Link
                to={item.path}
                className={`group relative flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                  isActiveRoute(item.path) ? "bg-gray-700 text-white" : ""
                }`}
                title={!isExpanded ? item.label : ""}
              >
                <div className="flex items-center min-w-0">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {isExpanded && <span className="ml-3 truncate">{item.label}</span>}
                </div>
                {isExpanded && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSection(item.id); }}
                    className="p-1 rounded hover:bg-gray-800"
                    aria-label="Toggle section"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        openSections[item.id] ? "rotate-0" : "-rotate-90"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>

              {/* Sub menu items - only show when expanded */}
              {isExpanded && item.subItems.length > 0 && openSections[item.id] && (
                <div className="ml-4 border-l border-gray-600">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className={`flex items-center px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ${
                        isActiveRoute(subItem.path)
                          ? "bg-gray-700 text-white"
                          : ""
                      }`}
                    >
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-gray-900">
          <Link
            to="/"
            className="group relative flex items-center text-gray-400 hover:text-white transition-colors"
            title={!isExpanded ? "На главную" : ""}
          >
            <span className="text-xl flex-shrink-0">🏠</span>
            {isExpanded && <span className="ml-3">На главную</span>}

            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                На главную
              </div>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
