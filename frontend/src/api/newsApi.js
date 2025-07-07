// API base URL - измените на ваш сервер
const API_BASE_URL = 'http://localhost:4000/api';

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