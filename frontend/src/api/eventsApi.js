// API base URL - измените на ваш сервер
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

class EventsApi {
  // Получить предстоящие события
  static async getUpcomingEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        lang: "kz",
        upcoming: "true",
        ...params,
      });

      const response = await fetch(`${API_BASE_URL}/events?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  }

  // Получить все активные события
  static async getActiveEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        lang: "kz",
        page: 1,
        limit: 50,
        ...params,
      });

      const response = await fetch(`${API_BASE_URL}/events?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching active events:", error);
      throw error;
    }
  }

  // Получить конкретное событие по ID
  static async getEventById(id, lang = "kz") {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}?lang=${lang}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      throw error;
    }
  }

  // ====== АДМИНСКИЕ МЕТОДЫ ======

  // Получить все события (для админки)
  static async getAllEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        lang: "kz",
        page: 1,
        limit: 20,
        ...params,
      });

      const response = await fetch(`${API_BASE_URL}/events?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }

  // Получить черновики событий
  static async getEventDrafts(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        lang: "kz",
        page: 1,
        limit: 20,
        ...params,
      });

      const response = await fetch(
        `${API_BASE_URL}/events/drafts?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching event drafts:", error);
      throw error;
    }
  }

  // Создать черновик события
  static async createEventDraft(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating event draft:", error);
      throw error;
    }
  }

  // Получить все переводы события
  static async getEventTranslations(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}/translations`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching event translations:", error);
      throw error;
    }
  }

  // Добавить перевод события
  static async addEventTranslation(id, lang, translationData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${id}/translations/${lang}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translationData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding event translation:", error);
      throw error;
    }
  }

  // Обновить перевод события
  static async updateEventTranslation(id, lang, translationData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${id}/translations/${lang}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translationData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating event translation:", error);
      throw error;
    }
  }

  // Удалить перевод события
  static async deleteEventTranslation(id, lang) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${id}/translations/${lang}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting event translation:", error);
      throw error;
    }
  }

  // Активировать событие
  static async activateEvent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}/activate`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error activating event:", error);
      throw error;
    }
  }

  // Деактивировать событие
  static async deactivateEvent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}/deactivate`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deactivating event:", error);
      throw error;
    }
  }

  // Удалить событие
  static async deleteEvent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Группировка событий по датам для календаря
  static groupEventsByDate(events) {
    const grouped = {};

    events.forEach((event) => {
      const eventDateParts = event.eventDate.split("-");
      const eventDate = new Date(
        parseInt(eventDateParts[0]),
        parseInt(eventDateParts[1]) - 1,
        parseInt(eventDateParts[2])
      );

      const dateKey = this.formatDateKey(eventDate);

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: this.formatDate(eventDate),
          day: this.formatDay(eventDate),
          events: [],
        };
      }

      grouped[dateKey].events.push({
        id: event.id,
        title: event.name,
        time: event.eventTime ? this.formatTime(event.eventTime) : "Күн бойы",
        location: event.place,
        isUpcoming: event.isUpcoming,
      });
    });

    return grouped;
  }

  // Получить следующие 5-7 дней с событиями
  static getUpcomingDatesWithEvents(groupedEvents, daysCount = 7) {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateKey = this.formatDateKey(date);

      const eventsForDate = groupedEvents[dateKey] || {
        date: this.formatDate(date),
        day: this.formatDay(date),
        events: [],
      };

      dates.push({
        ...eventsForDate,
        dateKey,
        hasEvents: eventsForDate.events.length > 0,
      });
    }

    return dates;
  }

  // Форматирование даты для ключа (YYYY-MM-DD)
  static formatDateKey(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Форматирование даты для отображения (DD.MM)
  static formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}`;
  }

  // Форматирование дня недели на казахском
  static formatDay(date) {
    const days = [
      "Жексенбі",
      "Дүйсенбі",
      "Сейсенбі",
      "Сәрсенбі",
      "Бейсенбі",
      "Жұма",
      "Сенбі",
    ];
    return days[date.getDay()];
  }

  // Форматирование времени (HH:MM)
  static formatTime(timeString) {
    if (!timeString) return "Күн бойы";

    const timeParts = timeString.split(":");
    if (timeParts.length >= 2) {
      return `${timeParts[0]}:${timeParts[1]}`;
    }

    return timeString;
  }

  // Форматирование полной даты для детального отображения
  static formatFullDate(dateString) {
    const date = new Date(dateString);
    const months = [
      "Қантар",
      "Ақпан",
      "Наурыз",
      "Сәуір",
      "Мамыр",
      "Маусым",
      "Шілде",
      "Тамыз",
      "Қыркүйек",
      "Қазан",
      "Қараша",
      "Желтоқсан",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  // Проверка доступности API
  static async checkApiHealth() {
    try {
      const response = await fetch(`${API_BASE_URL.replace("/api", "")}/`);
      return response.ok;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  }
}

export default EventsApi;
