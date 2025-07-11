
export const PUBLIC_ROUTES = {
  HOME: "/",
  NEWS: "/news",
  NEWS_DETAIL: "/news/:id",
  PAGE: "/page/:slug",
  ABOUT: "/about",
  CONTACT: "/contact",
  EVENTS: "/events",
  EVENT_DETAIL: "/events/:id",
};

export const ADMIN_ROUTES = {
  // Базовые
  ADMIN: "/admin",
  DASHBOARD: "/admin/dashboard",

  // Страницы - ОБНОВЛЕННЫЕ ПУТИ (admin/components/pages/)
  PAGES: "/admin/pages",
  PAGES_DRAFTS: "/admin/pages/drafts",
  PAGES_CREATE: "/admin/pages/create",
  PAGES_EDIT: "/admin/pages/edit/:id",
  PAGES_BLOCKS: "/admin/pages/:pageId/blocks",

  // Новости - ОБНОВЛЕННЫЕ ПУТИ (admin/components/news/)
  NEWS: "/admin/news",
  NEWS_DRAFTS: "/admin/news/drafts",
  NEWS_CREATE: "/admin/news/create",
  NEWS_EDIT: "/admin/news/edit/:id",

  // События - ОБНОВЛЕННЫЕ ПУТИ (admin/components/events/)
  EVENTS: "/admin/events",
  EVENTS_DRAFTS: "/admin/events/drafts",
  EVENTS_CREATE: "/admin/events/create",
  EVENTS_EDIT: "/admin/events/edit/:id",

  // Другие
  USERS: "/admin/users",
  MEDIA: "/admin/media",
  SETTINGS: "/admin/settings",
};

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

// Функции для генерации роутов с параметрами
export const generateRoute = {
  newsDetail: (id) => `/news/${id}`,
  pageBySlug: (slug) => `/page/${slug}`,
  adminPageEdit: (id) => `/admin/pages/edit/${id}`,
  adminPageBlocks: (pageId) => `/admin/pages/${pageId}/blocks`,
  adminNewsEdit: (id) => `/admin/news/edit/${id}`,
  adminEventEdit: (id) => `/admin/events/edit/${id}`,
};
