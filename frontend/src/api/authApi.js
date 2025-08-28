// API сервис для работы с NABRK OAuth2 Server
const API_BASE_URL = 'http://localhost:8082/auth-service'; // Измените на ваш сервер

class AuthApi {
  // Простая регистрация (базовая)
  static async simpleSignUp(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          groups: userData.groups || ['USER']
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Simple signup error:', error);
      throw error;
    }
  }

  // Расширенная регистрация (полный профиль)
  static async fullRegistration(profileData) {
    console.log('fullRegistration called with:', profileData);
    console.log('yearOfBirth type:', typeof profileData.yearOfBirth);
    console.log('yearOfBirth value:', profileData.yearOfBirth);
    
    try {
      const requestBody = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        middleName: profileData.middleName,
        email: profileData.email,
        genderId: profileData.genderId,
        yearOfBirth: profileData.yearOfBirth, // ИСПРАВЛЕНО: было profileData.birthYear
        nationalityId: profileData.nationalityId,
        homeAddress: profileData.homeAddress, // ИСПРАВЛЕНО: было profileData.address
        educationId: profileData.educationId,
        socialStatusId: profileData.socialStatusId,
        academicDegreeId: profileData.academicDegreeId,
        job: profileData.job, // ИСПРАВЛЕНО: было profileData.workplace
        placeOfStudy: profileData.placeOfStudy
      };

      console.log('Request body being sent:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_BASE_URL}/api/user/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Full registration error:', error);
      throw error;
    }
  }

  // Вход в систему
  static async signIn(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Сохраняем токен в localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          roles: data.roles
        }));
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Восстановление пароля
  static async passwordRecovery(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/passwordRecovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password recovery failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password recovery error:', error);
      throw error;
    }
  }

  // Сброс пароля
  static async passwordReset(resetData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/passwordReset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetData.token,
          newPassword: resetData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Изменение основных данных
  static async mainDataChange(profileData) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/api/user/mainDataChange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          middleName: profileData.middleName,
          email: profileData.email,
          genderId: profileData.genderId,
          yearOfBirth: profileData.yearOfBirth, // ИСПРАВЛЕНО: было profileData.birthYear
          nationalityId: profileData.nationalityId,
          homeAddress: profileData.homeAddress, // ИСПРАВЛЕНО: было profileData.address
          educationId: profileData.educationId,
          socialStatusId: profileData.socialStatusId,
          academicDegreeId: profileData.academicDegreeId,
          job: profileData.job, // ИСПРАВЛЕНО: было profileData.workplace
          placeOfStudy: profileData.placeOfStudy
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Data change failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Main data change error:', error);
      throw error;
    }
  }

  // Получение информации о текущем пользователе
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      return await response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Выход из системы
  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Проверка авторизации
  static isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Получение токена
  static getToken() {
    return localStorage.getItem('authToken');
  }

  // Получение пользователя из localStorage
  static getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default AuthApi;