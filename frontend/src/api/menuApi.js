// api/menuApi.js
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const menuApi = {
  // ===========================================
  // ОСНОВНЫЕ CRUD ОПЕРАЦИИ
  // ===========================================

  // Получить всю структуру меню
  getMenu: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching menu:", error);
      throw error;
    }
  },

  // Создать пункт меню
  createMenuItem: async (menuData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating menu item:", error);
      throw error;
    }
  },

  // Обновить пункт меню
  updateMenuItem: async (id, menuData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  },

  // Удалить пункт меню
  deleteMenuItem: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  },

  // ===========================================
  // ПОИСК И ВАЛИДАЦИЯ
  // ===========================================

  // Поиск страниц
  searchPages: async (query) => {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/menu/search-pages?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error searching pages:", error);
      throw error;
    }
  },

  // Получить страницу по slug (для валидации)
  getPageBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/page/${encodeURIComponent(slug)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching page by slug:", error);
      throw error;
    }
  },

  // ===========================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ===========================================

  // Валидация URL
  validateUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Создать родительский пункт меню
  createParentMenuItem: async (label, order = null) => {
    return await menuApi.createMenuItem({
      parentId: null,
      type: "title",
      label,
      order,
    });
  },

  // Создать дочерний пункт меню
  createChildMenuItem: async (parentId, type, label, url = null, pageSlug = null, order = null) => {
    const menuData = {
      parentId,
      type,
      label,
      order,
    };

    if (type === "link") {
      menuData.url = url;
    } else if (type === "page") {
      menuData.pageSlug = pageSlug;
    }

    return await menuApi.createMenuItem(menuData);
  },

  // Обновить только название пункта
  updateMenuItemLabel: async (id, label) => {
    return await menuApi.updateMenuItem(id, { label });
  },

  // Обновить только URL пункта
  updateMenuItemUrl: async (id, url) => {
    return await menuApi.updateMenuItem(id, { url });
  },

  // Обновить только slug страницы
  updateMenuItemPageSlug: async (id, pageSlug) => {
    return await menuApi.updateMenuItem(id, { pageSlug });
  },

  // Изменить порядок пункта
  updateMenuItemOrder: async (id, order) => {
    return await menuApi.updateMenuItem(id, { order });
  },

  // ===========================================
  // УТИЛИТЫ ДЛЯ РАБОТЫ С МЕНЮ
  // ===========================================

  // Получить следующий порядковый номер для родительского пункта
  getNextParentOrder: async () => {
    try {
      const menu = await menuApi.getMenu();
      const parentItems = menu.filter(item => !item.parentId);
      return parentItems.length > 0 ? Math.max(...parentItems.map(item => item.order || 0)) + 1 : 1;
    } catch (error) {
      console.error("Error getting next parent order:", error);
      return 1;
    }
  },

  // Получить следующий порядковый номер для дочернего пункта
  getNextChildOrder: async (parentId) => {
    try {
      const menu = await menuApi.getMenu();
      const parentItem = menu.find(item => item.id === parentId);
      if (!parentItem || !parentItem.children) {
        return 1;
      }
      return parentItem.children.length > 0 ? Math.max(...parentItem.children.map(child => child.order || 0)) + 1 : 1;
    } catch (error) {
      console.error("Error getting next child order:", error);
      return 1;
    }
  },

  // Проверить, можно ли удалить пункт (нет дочерних элементов)
  canDeleteMenuItem: async (id) => {
    try {
      const menu = await menuApi.getMenu();
      const item = menu.find(item => item.id === id);
      return !item || !item.children || item.children.length === 0;
    } catch (error) {
      console.error("Error checking if menu item can be deleted:", error);
      return false;
    }
  },

  // Получить все дочерние элементы пункта (рекурсивно)
  getAllChildren: (menuItem) => {
    if (!menuItem.children || menuItem.children.length === 0) {
      return [];
    }

    let allChildren = [...menuItem.children];
    menuItem.children.forEach(child => {
      allChildren = allChildren.concat(menuApi.getAllChildren(child));
    });

    return allChildren;
  },

  // Подсчитать общее количество дочерних элементов
  getChildrenCount: (menuItem) => {
    return menuApi.getAllChildren(menuItem).length;
  },
};

export default menuApi;
