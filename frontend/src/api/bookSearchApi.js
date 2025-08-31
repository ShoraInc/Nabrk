// API сервис для поиска книг
const API_BASE_URL = 'http://localhost:4001';

export class BookSearchApi {
  static async search(data) {
    try {
      // Реальный API вызов к node-search-backend
      const response = await fetch(`${API_BASE_URL}/view/Search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Search failed');
    }
  }

  static async getSearchFields(lang = 'ru') {
    const response = await fetch(`${API_BASE_URL}/view/SearchFieldList?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch search fields');
    }
    return response.json();
  }

  static async getSuggestions(fieldName, searchText) {
    const encodedField = encodeURIComponent(fieldName);
    const encodedText = encodeURIComponent(searchText);

    const response = await fetch(
      `${API_BASE_URL}/view/Suggest?fieldName=${encodedField}&searchText=${encodedText}`
    );

    if (!response.ok) {
      return [];
    }

    return response.json();
  }
}
