// QuestionsApi.js - API для Questions компонента

// Базовый URL для API - безопасно добавляем /api только если его нет
const RAW_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const API_BASE_URL = RAW_BASE.endsWith('/api') ? RAW_BASE : `${RAW_BASE}/api`;

// Утилита для выполнения HTTP запросов
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Добавьте авторизацию если нужно
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Получить все типы/категории вопросов
export const getTypes = async () => {
  try {
    const response = await apiRequest('/types');
    return response;
  } catch (error) {
    // Возвращаем заглушку в случае ошибки для тестирования
    console.warn('getTypes failed, returning mock data:', error);
    return {
      types: [
        {
          id: 1,
          titles: {
            kz: 'Жалпы сұрақтар',
            ru: 'Общие вопросы', 
            en: 'General Questions'
          }
        },
        {
          id: 2,
          titles: {
            kz: 'Техникалық көмек',
            ru: 'Техническая поддержка',
            en: 'Technical Support'
          }
        },
        {
          id: 3,
          titles: {
            kz: 'Биллинг',
            ru: 'Биллинг',
            en: 'Billing'
          }
        }
      ]
    };
  }
};

// Отправить новый вопрос
export const postQuestion = async (questionData) => {
  try {
    const response = await apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
    return response;
  } catch (error) {
    // Возвращаем заглушку в случае ошибки для тестирования
    console.warn('postQuestion failed, returning mock response:', error);
    return {
      newQuestion: {
        id: Date.now(),
        ...questionData,
        createdAt: new Date().toISOString()
      }
    };
  }
};

// Получить вопросы с фильтрами (только отвеченные)
export const QuestionTrue = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Добавляем фильтры в query параметры
    if (filters.query) {
      queryParams.append('search', filters.query);
    }
    
    if (filters.typeId) {
      queryParams.append('typeId', filters.typeId.toString());
    }
    
    // По умолчанию получаем только отвеченные вопросы
    queryParams.append('answered', 'true');
    
    const endpoint = `/questions?${queryParams.toString()}`;
    const response = await apiRequest(endpoint);
    return response;
  } catch (error) {
    // Возвращаем заглушку в случае ошибки для тестирования
    console.warn('QuestionTrue failed, returning mock data:', error);
    return {
      questions: [
        {
          id: 1,
          Name: 'Айдар',
          LastName: 'Жасұланов',
          Question: 'Сайтқа қалай тіркелуге болады?',
          Answer: {
            answer: 'Сайтқа тіркелу үшін "Тіркелу" батырмасын басып, барлық қажетті ақпараттарды толтырыңыз.',
            createdAt: '2024-01-15T10:30:00Z',
            Type: {
              titles: { kz: 'Жалпы сұрақтар', ru: 'Общие вопросы', en: 'General Questions' }
            }
          }
        },
        {
          id: 2,
          Name: 'Мария',
          LastName: 'Петрова',
          Question: 'Как восстановить пароль?',
          Answer: {
            answer: 'Для восстановления пароля нажмите на ссылку "Забыли пароль?" на странице входа и следуйте инструкциям.',
            createdAt: '2024-01-14T15:45:00Z',
            Type: {
              titles: { kz: 'Техникалық көмек', ru: 'Техническая поддержка', en: 'Technical Support' }
            }
          }
        },
        {
          id: 3,
          Name: 'John',
          LastName: 'Smith', 
          Question: 'How can I change my subscription plan?',
          Answer: {
            answer: 'You can change your subscription plan in your account settings under the "Billing" section.',
            createdAt: '2024-01-13T09:20:00Z',
            Type: {
              titles: { kz: 'Биллинг', ru: 'Биллинг', en: 'Billing' }
            }
          }
        }
      ]
    };
  }
};

// ===== ADMIN endpoints =====
export const admin = {
  // Questions list with search
  getQuestions: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/questions${query ? `?${query}` : ''}`);
  },
  deleteQuestion: async (id) => apiRequest(`/questions/${id}`, { method: 'DELETE' }),

  // Answers
  getAnswers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/answers${query ? `?${query}` : ''}`);
  },
  createAnswer: async (data) => apiRequest('/answers', { method: 'POST', body: JSON.stringify(data) }),
  updateAnswer: async (id, data) => apiRequest(`/answers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAnswer: async (id) => apiRequest(`/answers/${id}`, { method: 'DELETE' }),
  publishAnswer: async (id) => apiRequest(`/answers/${id}/publish`, { method: 'PUT' }),
  unpublishAnswer: async (id) => apiRequest(`/answers/${id}/unpublish`, { method: 'PUT' }),

  // Types
  getTypes: async () => apiRequest('/types'),
  createType: async (translations) => apiRequest('/types', { method: 'POST', body: JSON.stringify({ translations }) }),
  updateType: async (id, translations) => apiRequest(`/types/${id}`, { method: 'PATCH', body: JSON.stringify({ translations }) }),
  deleteType: async (id) => apiRequest(`/types/${id}`, { method: 'DELETE' }),
};

// Дополнительные API функции (если понадобятся)

// Получить конкретный вопрос по ID
export const getQuestionById = async (id) => {
  try {
    const response = await apiRequest(`/questions/${id}`);
    return response;
  } catch (error) {
    console.error('Failed to get question by ID:', error);
    throw error;
  }
};

// Обновить вопрос (если нужно)
export const updateQuestion = async (id, updateData) => {
  try {
    const response = await apiRequest(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response;
  } catch (error) {
    console.error('Failed to update question:', error);
    throw error;
  }
};

// Удалить вопрос (если нужно)
export const deleteQuestion = async (id) => {
  try {
    const response = await apiRequest(`/questions/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Failed to delete question:', error);
    throw error;
  }
};

// Получить статистику (если нужно)
export const getQuestionsStats = async () => {
  try {
    const response = await apiRequest('/questions/stats');
    return response;
  } catch (error) {
    console.warn('getQuestionsStats failed, returning mock data:', error);
    return {
      total: 150,
      answered: 142,
      pending: 8,
      categories: {
        'Жалпы сұрақтар': 85,
        'Техническая поддержка': 42,
        'Billing': 15
      }
    };
  }
};

export default {
  getTypes,
  postQuestion,
  QuestionTrue,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsStats
};