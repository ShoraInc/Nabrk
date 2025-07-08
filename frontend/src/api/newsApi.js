// API base URL - измените на ваш сервер
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

class NewsApi {
  // Получить опубликованные новости
  static async getPublishedNews(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        lang: 'kz', // по умолчанию казахский
        page: 1,
        limit: 5, // для главной страницы берем только 5 новостей
        ...params
      });

      const response = await fetch(`${API_BASE_URL}/news?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  // Получить конкретную новость по ID
  static async getNewsById(id, lang = 'kz') {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}?lang=${lang}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      throw error;
    }
  }

  // Получить все новости (для страницы "все новости")
  static async getAllNews(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        lang: 'kz',
        page: 1,
        limit: 20,
        ...params
      });

      const response = await fetch(`${API_BASE_URL}/news?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  }

  // ====== АДМИНСКИЕ МЕТОДЫ ======

  // Получить черновики новостей
  static async getNewsDrafts(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        lang: 'kz',
        page: 1,
        limit: 20,
        ...params
      });

      const response = await fetch(`${API_BASE_URL}/news/drafts?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }
  }

  // Создать черновик новости
  static async createNewsDraft(newsData) {
    try {
      const formData = new FormData();
      formData.append('title', newsData.title);
      formData.append('content', newsData.content);
      formData.append('language', newsData.language || 'kz');
      
      if (newsData.shortDescription) {
        formData.append('shortDescription', newsData.shortDescription);
      }
      
      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      const response = await fetch(`${API_BASE_URL}/news/draft`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating news draft:', error);
      throw error;
    }
  }

  // Получить все переводы новости
  static async getNewsTranslations(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/translations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  }

  // Добавить перевод
  static async addNewsTranslation(id, lang, translationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/translations/${lang}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding translation:', error);
      throw error;
    }
  }

  // Обновить перевод
  static async updateNewsTranslation(id, lang, translationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/translations/${lang}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  }

  // Удалить перевод
  static async deleteNewsTranslation(id, lang) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/translations/${lang}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting translation:', error);
      throw error;
    }
  }

  // Опубликовать новость
  static async publishNews(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/publish`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error publishing news:', error);
      throw error;
    }
  }

  // Отменить публикацию
  static async unpublishNews(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}/unpublish`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error unpublishing news:', error);
      throw error;
    }
  }

  // Удалить новость
  static async deleteNews(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }

  // Форматировать дату для отображения
  static formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
      'Қантар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым',
      'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }

  // Проверка доступности API
  static async checkApiHealth() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

export default NewsApi;