import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventsApi from '../../../api/eventsApi';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';

const AdminEventsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    place: '',
    eventDate: '',
    eventTime: '',
    language: 'kz'
  });
  const [dateTimeChanged, setDateTimeChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState({});
  const [currentLang, setCurrentLang] = useState('kz');

  const languages = [
    { code: 'kz', name: 'Қазақша' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'qaz', name: 'Qazaqsha (Latin)' },
  ];

  useEffect(() => {
    if (isEdit) {
      fetchEventData();
    }
  }, [id, isEdit]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const data = await EventsApi.getEventTranslations(id);
      setTranslations(data.translations);
      
      // Устанавливаем дату и время из основной информации о событии
      const eventDate = data.eventDate ? data.eventDate.split('T')[0] : ''; // Извлекаем только дату (YYYY-MM-DD)
      const eventTime = data.eventTime || '';
      
      if (data.translations[currentLang]) {
        setFormData({
          name: data.translations[currentLang].name || '',
          description: data.translations[currentLang].description || '',
          place: data.translations[currentLang].place || '',
          eventDate: eventDate,
          eventTime: eventTime,
          language: currentLang
        });
      } else {
        // Если нет перевода для текущего языка, устанавливаем хотя бы дату и время
        setFormData(prev => ({
          ...prev,
          eventDate: eventDate,
          eventTime: eventTime
        }));
      }
    } catch (err) {
      setError('Ошибка при загрузке данных события');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Отслеживаем изменения даты и времени
    if (name === 'eventDate' || name === 'eventTime') {
      setDateTimeChanged(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (langCode) => {
    setTranslations(prev => ({
      ...prev,
      [currentLang]: {
        name: formData.name,
        description: formData.description,
        place: formData.place
      }
    }));

    setCurrentLang(langCode);
    
    const langData = translations[langCode] || { name: '', description: '', place: '' };
    setFormData(prev => ({
      name: langData.name || '',
      description: langData.description || '',
      place: langData.place || '',
      eventDate: prev.eventDate, // Сохраняем дату при переключении языков
      eventTime: prev.eventTime, // Сохраняем время при переключении языков
      language: langCode
    }));
  };

  const updateEventDateTime = async () => {
    if (!dateTimeChanged) return;

    try {
      const result = await EventsApi.updateEvent(id, {
        eventDate: formData.eventDate,
        eventTime: formData.eventTime || null
      });
      setDateTimeChanged(false);
      return result;
    } catch (err) {
      console.error('Error updating event date/time:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.place || !formData.eventDate) {
      setError('Название, описание, место и дата события обязательны');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit) {
        // Update date/time first if changed
        if (dateTimeChanged) {
          await updateEventDateTime();
        }

        // Update current language translation
        await EventsApi.updateEventTranslation(id, currentLang, {
          name: formData.name,
          description: formData.description,
          place: formData.place
        });
        
        // Update other language translations
        for (const [lang, data] of Object.entries(translations)) {
          if (lang !== currentLang && (data.name || data.description || data.place)) {
            try {
              await EventsApi.updateEventTranslation(id, lang, data);
            } catch (err) {
              await EventsApi.addEventTranslation(id, lang, data);
            }
          }
        }
      } else {
        const eventData = {
          name: formData.name,
          description: formData.description,
          place: formData.place,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime || null,
          language: formData.language
        };
        
        const result = await EventsApi.createEventDraft(eventData);
        
        for (const [lang, data] of Object.entries(translations)) {
          if (lang !== formData.language && (data.name || data.description || data.place)) {
            await EventsApi.addEventTranslation(result.id, lang, data);
          }
        }
      }

      navigate('/admin/events/drafts');
    } catch (err) {
      setError('Ошибка при сохранении события');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? 'ml-64' : 'ml-16'
  }`;

  if (loading && isEdit) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar onToggle={setSidebarExpanded} />
        <div className={contentClass}>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onToggle={setSidebarExpanded} />
      
      <div className={contentClass}>
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Редактировать событие' : 'Создать событие'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Изменение существующего события' : 'Создание нового события'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Переключатель языков */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Выберите язык для редактирования
              </label>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentLang === lang.code
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang.name}
                    {lang.code === 'qaz' && (
                      <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded">Новый</span>
                    )}
                    {translations[lang.code] && (translations[lang.code].name || translations[lang.code].description) && (
                      <span className="ml-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Переключайтесь между языками для добавления переводов
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Основные поля - 2 колонки */}
              <div className="xl:col-span-2 space-y-6">
                {/* Название события */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Название события *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Введите название события"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Краткое и понятное название события
                  </p>
                </div>

                {/* Место проведения */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Место проведения *
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Укажите место проведения события"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Адрес или название места проведения
                  </p>
                </div>

                {/* Описание события */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Описание события *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Подробное описание события..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Подробная информация о событии, программе, участниках
                  </p>
                </div>
              </div>

              {/* Правая боковая панель - 1 колонка */}
              <div className="space-y-6">
                {/* Дата и время */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Дата события *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  
                  <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">
                    Время события
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {isEdit && dateTimeChanged && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Дата и время будут обновлены при сохранении формы
                      </p>
                    </div>
                  )}
                  
                  <p className="mt-2 text-sm text-gray-500">
                    Оставьте время пустым для событий на весь день
                    {isEdit && <span> • При редактировании можно изменить дату и время</span>}
                  </p>
                </div>

                {/* Статус переводов */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Статус переводов</h3>
                  <div className="space-y-3">
                    {languages.map((lang) => (
                      <div key={lang.code} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                          {lang.code === 'qaz' && (
                            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded">Новый</span>
                          )}
                        </div>
                        <div className="text-sm">
                          {translations[lang.code] && (translations[lang.code].name || translations[lang.code].description) ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                              ✓ Готов
                            </span>
                          ) : (
                            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                              Не заполнен
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    Заполните информацию для всех необходимых языков
                  </p>
                </div>

                {/* Подсказки */}
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">📅 Советы</h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• Выберите понятное название</li>
                    <li>• Укажите точный адрес места</li>
                    <li>• Добавьте подробное описание</li>
                    <li>• Проверьте дату и время</li>
                    <li>• Заполните переводы на все языки</li>
                    {isEdit && <li>• При редактировании можно изменить дату и время</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Сохранение...
                      </>
                    ) : (
                      isEdit ? '💾 Сохранить изменения' : '📝 Создать черновик'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/admin/events/drafts')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    ❌ Отмена
                  </button>
                </div>
                
                <div className="text-sm text-gray-500 flex items-center">
                  <span>Все поля отмеченные * обязательны для заполнения</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEventsForm;