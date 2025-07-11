// api/blocksApi.js
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const blocksApi = {
  // ===========================================
  // ОБЩИЕ МЕТОДЫ
  // ===========================================

  // Получить все блоки страницы
  getBlocksByPageSlug: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/page/${slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching blocks by page slug:", error);
      throw error;
    }
  },

  // Получить блок по ID
  getBlockById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching block by ID:", error);
      throw error;
    }
  },

  // Удалить блок
  deleteBlock: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting block:", error);
      throw error;
    }
  },

  // Получить опции для всех блоков
  getBlockOptions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/options`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching block options:", error);
      throw error;
    }
  },

  // ===========================================
  // TITLE БЛОКИ
  // ===========================================

  // Создать title блок
  createTitleBlock: async (blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/title`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating title block:", error);
      throw error;
    }
  },

  // Обновить title блок
  updateTitleBlock: async (id, blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/title/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating title block:", error);
      throw error;
    }
  },

  // Получить переводы title блока
  getTitleTranslations: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/title/${id}/translations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching title translations:", error);
      throw error;
    }
  },

  // Создать/обновить перевод title блока
  upsertTitleTranslation: async (id, lang, text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/title/${id}/translations/${lang}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error upserting title translation:", error);
      throw error;
    }
  },

  // Удалить перевод title блока
  deleteTitleTranslation: async (id, lang) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/title/${id}/translations/${lang}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting title translation:", error);
      throw error;
    }
  },

  // ===========================================
  // LINE БЛОКИ
  // ===========================================

  // Создать line блок
  createLineBlock: async (blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/line`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating line block:", error);
      throw error;
    }
  },

  // Обновить line блок
  updateLineBlock: async (id, blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/line/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating line block:", error);
      throw error;
    }
  },

  updateContactInfoBlock: async (id, blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/contact-info/${id}/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blockData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating line block:", error);
      throw error;
    }
  },
};

export default blocksApi;