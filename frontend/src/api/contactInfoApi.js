// api/contactInfoApi.js
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const contactInfoApi = {
  // ===========================================
  // БЛОКИ КОНТАКТНОЙ ИНФОРМАЦИИ
  // ===========================================

  // Создать contact-info блок
  createBlock: async (blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/contact-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating contact-info block:", error);
      throw error;
    }
  },

  // Получить contact-info блок по ID
  getBlock: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/contact-info/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching contact-info block:", error);
      throw error;
    }
  },

  // Обновить contact-info блок
  updateBlock: async (id, blockData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blockData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating contact-info block:", error);
      throw error;
    }
  },

  // Удалить contact-info блок
  deleteBlock: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting contact-info block:", error);
      throw error;
    }
  },

  // ===========================================
  // ЭЛЕМЕНТЫ КОНТАКТНОЙ ИНФОРМАЦИИ
  // ===========================================

  // Создать элемент (без файла)
  createItem: async (blockId, itemData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/${blockId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating contact-info item:", error);
      throw error;
    }
  },

  // Создать элемент с файлом
  createItemWithFile: async (blockId, itemData, file) => {
    try {
      const formData = new FormData();

      // Добавляем данные элемента
      Object.entries(itemData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Добавляем файл
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/${blockId}/items`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating contact-info item with file:", error);
      throw error;
    }
  },

  // Обновить элемент (без файла)
  updateItem: async (itemId, itemData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating contact-info item:", error);
      throw error;
    }
  },

  // Обновить элемент с файлом
  updateItemWithFile: async (itemId, itemData, file) => {
    try {
      const formData = new FormData();

      // Добавляем данные элемента
      Object.entries(itemData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Добавляем файл если есть
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/items/${itemId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating contact-info item with file:", error);
      throw error;
    }
  },

  // Удалить элемент
  deleteItem: async (itemId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/items/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting contact-info item:", error);
      throw error;
    }
  },

  // Изменить порядок элементов
  reorderItems: async (blockId, itemsOrder) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/${blockId}/items/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemsOrder }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error reordering contact-info items:", error);
      throw error;
    }
  },

  // ===========================================
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ===========================================

  // Получить доступные иконки
  getAvailableIcons: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blocks/contact-info/icons/available`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching available icons:", error);
      throw error;
    }
  },

  // ===========================================
  // УНИВЕРСАЛЬНЫЕ МЕТОДЫ
  // ===========================================

  // Создать элемент (автоматически определяет нужен ли файл)
  createItemAuto: async (blockId, itemData, file = null) => {
    if (itemData.type === "file" && file) {
      return contactInfoApi.createItemWithFile(blockId, itemData, file);
    } else {
      return contactInfoApi.createItem(blockId, itemData);
    }
  },

  // Обновить элемент (автоматически определяет нужен ли файл)
  updateItemAuto: async (itemId, itemData, file = null) => {
    if (file) {
      return contactInfoApi.updateItemWithFile(itemId, itemData, file);
    } else {
      return contactInfoApi.updateItem(itemId, itemData);
    }
  },
};

export default contactInfoApi;
