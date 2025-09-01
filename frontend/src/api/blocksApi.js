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

  // Получить родительские блоки
  getParentBlocks: async (childBlockId, relationType) => {
    try {
      const params = new URLSearchParams();
      if (relationType) {
        params.append('relationType', relationType);
      }

      const response = await fetch(`${API_BASE_URL}/blocks/${childBlockId}/parents?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching parent blocks:", error);
      throw error;
    }
  },

  // Проверить, используется ли блок как ответ в FAQ
  checkBlockUsedInFaq: async (blockId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/${blockId}/used-in-faq`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.used ;
    } catch (e) {
      return false;
    }
  },

  // ===========================================
  // TEXT-IMAGE BLOCK МЕТОДЫ
  // ===========================================

  // Создать text-image блок
  createTextImageBlock: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text-image`, {
        method: "POST",
        body: formData, // FormData с изображением
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating text-image block:", error);
      throw error;
    }
  },

  // Получить text-image блок
  getTextImageBlock: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text-image/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching text-image block:", error);
      throw error;
    }
  },

  // Обновить text-image блок
  updateTextImageBlock: async (id, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text-image/${id}`, {
        method: "PUT",
        body: formData, // FormData с изображением (если есть)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating text-image block:", error);
      throw error;
    }
  },

  // Удалить text-image блок
  deleteTextImageBlock: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text-image/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting text-image block:", error);
      throw error;
    }
  },

  // Создать/обновить перевод для text-image блока
  upsertTextImageTranslation: async (blockId, language, text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text-image/${blockId}/translations/${language}`, {
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
      console.error("Error upserting text-image translation:", error);
      throw error;
    }
  },

  // Получить все переводы text-image блока
  getTextImageTranslations: async (blockId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text-image/${blockId}/translations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching text-image translations:", error);
      throw error;
    }
  },

  // Удалить перевод text-image блока
  deleteTextImageTranslation: async (blockId, language) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text-image/${blockId}/translations/${language}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting text-image translation:", error);
      throw error;
    }
  },

  // ===========================================
  // BUTTON BLOCK МЕТОДЫ
  // ===========================================

  // Создать button блок
  createButtonBlock: async (blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/button`, {
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
      console.error("Error creating button block:", error);
      throw error;
    }
  },

  // Получить button блок
  getButtonBlock: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/button/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching button block:", error);
      throw error;
    }
  },

  // Обновить button блок
  updateButtonBlock: async (id, blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/button/${id}`, {
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
      console.error("Error updating button block:", error);
      throw error;
    }
  },

  // Удалить button блок
  deleteButtonBlock: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/button/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting button block:", error);
      throw error;
    }
  },

  // Создать/обновить перевод для button блока
  upsertButtonTranslation: async (blockId, language, text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/button/${blockId}/translations/${language}`, {
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
      console.error("Error upserting button translation:", error);
      throw error;
    }
  },

  // Получить все переводы button блока
  getButtonTranslations: async (blockId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/button/${blockId}/translations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching button translations:", error);
      throw error;
    }
  },

  // Удалить перевод button блока
  deleteButtonTranslation: async (blockId, language) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/button/${blockId}/translations/${language}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting button translation:", error);
      throw error;
    }
  },

  // =============================================================================
  // TEXT BLOCK API METHODS
  // =============================================================================

  // Создать text блок
  createTextBlock: async (blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text`, {
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
      console.error("Error creating text block:", error);
      throw error;
    }
  },

  // Получить text блок по ID
  getTextBlock: async (blockId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text/${blockId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching text block:", error);
      throw error;
    }
  },

  // Обновить text блок
  updateTextBlock: async (blockId, blockData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text/${blockId}`, {
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
      console.error("Error updating text block:", error);
      throw error;
    }
  },

  // Удалить text блок
  deleteTextBlock: async (blockId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text/${blockId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting text block:", error);
      throw error;
    }
  },

  // Добавить/обновить перевод text блока
  upsertTextTranslation: async (blockId, language, text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text/${blockId}/translations/${language}`, {
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
      console.error("Error upserting text translation:", error);
      throw error;
    }
  },

  // Получить все переводы text блока
  getTextTranslations: async (blockId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text/${blockId}/translations`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching text translations:", error);
      throw error;
    }
  },

  // Удалить перевод text блока
  deleteTextTranslation: async (blockId, language) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blocks/text/${blockId}/translations/${language}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting text translation:", error);
      throw error;
    }
  },
  // ========================
  // Image Block API Methods  
  // ========================

  // Создание image блока
  createImageBlock: async (blockData) => {
    const formData = new FormData();
    
    // Добавляем основные поля
    formData.append('pageId', blockData.pageId);
    formData.append('order', blockData.order);
    formData.append('displayMode', blockData.displayMode || 'single');
    formData.append('aspectRatio', blockData.aspectRatio || 'auto');
    formData.append('alignment', blockData.alignment || 'center');
    formData.append('marginTop', blockData.marginTop || 0);
    formData.append('marginBottom', blockData.marginBottom || 16);
    formData.append('autoPlay', blockData.autoPlay || false);
    formData.append('showDots', blockData.showDots !== undefined ? blockData.showDots : true);
    formData.append('showArrows', blockData.showArrows !== undefined ? blockData.showArrows : true);
    formData.append('slideSpeed', blockData.slideSpeed || 5000);
    formData.append('isHidden', blockData.isHidden || false);
    
    // Добавляем изображения
    if (blockData.images && blockData.images.length > 0) {
      blockData.images.forEach((imageData, index) => {
        if (imageData.file) {
          formData.append('images', imageData.file);
        }
        if (imageData.alt) {
          formData.append(`alt_${index}`, imageData.alt);
        }
        if (imageData.caption) {
          formData.append(`caption_${index}`, imageData.caption);
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/blocks/image`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create image block');
    }

    return await response.json();
  },

  // Получение image блока
  getImageBlock: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blocks/image/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get image block');
    }

    return await response.json();
  },

  // Обновление image блока
  updateImageBlock: async (id, blockData) => {
    const formData = new FormData();
    
    // Добавляем основные поля
    formData.append('displayMode', blockData.displayMode || 'single');
    formData.append('aspectRatio', blockData.aspectRatio || 'auto');
    formData.append('alignment', blockData.alignment || 'center');
    formData.append('marginTop', blockData.marginTop || 0);
    formData.append('marginBottom', blockData.marginBottom || 16);
    formData.append('autoPlay', blockData.autoPlay || false);
    formData.append('showDots', blockData.showDots !== undefined ? blockData.showDots : true);
    formData.append('showArrows', blockData.showArrows !== undefined ? blockData.showArrows : true);
    formData.append('slideSpeed', blockData.slideSpeed || 5000);
    formData.append('isHidden', blockData.isHidden || false);
    formData.append('keepExistingImages', blockData.keepExistingImages || false);
    
    // Добавляем новые изображения
    if (blockData.images && blockData.images.length > 0) {
      blockData.images.forEach((imageData, index) => {
        if (imageData.file) {
          formData.append('images', imageData.file);
        }
        if (imageData.alt) {
          formData.append(`alt_${index}`, imageData.alt);
        }
        if (imageData.caption) {
          formData.append(`caption_${index}`, imageData.caption);
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/blocks/image/${id}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update image block');
    }

    return await response.json();
  },

  // Удаление image блока
  deleteImageBlock: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blocks/image/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete image block');
    }

    return await response.json();
  },

};

export default blocksApi;