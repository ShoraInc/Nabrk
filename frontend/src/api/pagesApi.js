// api/pagesApi.js
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const pagesApi = {
  // ===========================================
  // ПУБЛИЧНЫЕ МЕТОДЫ (для пользователей)
  // ===========================================

  // Получить опубликованные страницы
  getPublishedPages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/public`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching published pages:", error);
      throw error;
    }
  },

  // Получить опубликованную страницу по slug
  getPublishedPageBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/public/${slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching published page by slug:", error);
      throw error;
    }
  },

  // ===========================================
  // АДМИНСКИЕ МЕТОДЫ
  // ===========================================

  // Получить все страницы (включая черновики)
  getAllPagesAdmin: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all pages:", error);
      throw error;
    }
  },

  // Получить страницу по ID (админ)
  getPageByIdAdmin: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching page by ID:", error);
      throw error;
    }
  },

  // Создать страницу
  createPage: async (pageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  },

  // Обновить страницу
  updatePage: async (id, pageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating page:", error);
      throw error;
    }
  },

  // Опубликовать страницу
  publishPage: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin/${id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error publishing page:", error);
      throw error;
    }
  },

  // Снять с публикации
  unpublishPage: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin/${id}/unpublish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error unpublishing page:", error);
      throw error;
    }
  },

  // Удалить страницу
  deletePage: async (id, force = false) => {
    try {
      const url = force 
        ? `${API_BASE_URL}/pages/admin/${id}?force=true`
        : `${API_BASE_URL}/pages/admin/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting page:", error);
      throw error;
    }
  },

  // Получить статистику
  getPagesStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/admin/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching pages stats:", error);
      throw error;
    }
  },

  // ===========================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ===========================================

  // Фильтрация по статусу
  getPagesByStatus: async (status) => {
    try {
      const allPages = await pagesApi.getAllPagesAdmin();
      return allPages.filter(page => page.status === status);
    } catch (error) {
      console.error(`Error fetching pages with status ${status}:`, error);
      throw error;
    }
  },

  // Получить черновики
  getDraftPages: async () => {
    return await pagesApi.getPagesByStatus('draft');
  },

  // Получить опубликованные (через админ API)
  getPublishedPagesAdmin: async () => {
    return await pagesApi.getPagesByStatus('published');
  },
};

export default pagesApi;