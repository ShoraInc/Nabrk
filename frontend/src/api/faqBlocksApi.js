// api/faqBlocksApi.js
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const faqBlocksApi = {
  // Получить все блоки страницы
  getBlocksByPageSlug: async (pageId) => {
    try {
      // Сначала получаем информацию о странице по ID
      const pageResponse = await fetch(`${API_BASE_URL}/pages/admin/${parseInt(pageId)}`);
      if (!pageResponse.ok) {
        throw new Error(`HTTP error! status: ${pageResponse.status}`);
      }
      const page = await pageResponse.json();
      
      // Теперь получаем блоки по ID страницы
      const response = await fetch(`${API_BASE_URL}/blocks/page-id/${parseInt(pageId)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching blocks by page slug:", error);
      throw error;
    }
  },

  // Создать FAQ блок
  createFaqBlock: async (pageId, blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...blockData, pageId: parseInt(pageId) }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating FAQ block:", error);
      throw error;
    }
  },

  // Обновить FAQ блок
  updateFaqBlock: async (id, blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/faq/${id}`, {
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
      console.error("Error updating FAQ block:", error);
      throw error;
    }
  },

  // Добавить дочерний блок
  addChildBlock: async (parentBlockId, relationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/${parentBlockId}/relations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(relationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding child block:", error);
      throw error;
    }
  },

  // Получить дочерние блоки
  getChildBlocks: async (parentBlockId, relationType = "faq_answer") => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/${parentBlockId}/children?relationType=${relationType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching child blocks:", error);
      throw error;
    }
  },

  // Удалить дочерний блок
  removeChildBlock: async (parentBlockId, childBlockId, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.relationType) {
        params.append('relationType', options.relationType);
      }

      const response = await fetch(`${API_BASE_URL}/blocks/${parentBlockId}/relations/${childBlockId}?${params}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error removing child block:", error);
      throw error;
    }
  },

  // Обновить порядок дочерних блоков
  updateChildBlockOrder: async (parentBlockId, childBlockId, orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/${parentBlockId}/relations/${childBlockId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating child block order:", error);
      throw error;
    }
  },
};

export default faqBlocksApi;