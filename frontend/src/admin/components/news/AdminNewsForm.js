import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NewsApi from '../../../api/newsApi';
import AdminSidebar from '../../components/shared/AdminSidebar';
import { ADMIN_ROUTES } from '../../../routes/constants';

const AdminNewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    shortDescription: '',
    language: 'kz'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState({});
  const [currentLang, setCurrentLang] = useState('kz');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'kz', name: 'Қазақша' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchNewsData();
    }
  }, [id, isEdit]);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const data = await NewsApi.getNewsTranslations(id);
      setTranslations(data.translations);
      setCurrentImageUrl(data.imageUrl);
      
      if (data.translations[currentLang]) {
        setFormData({
          title: data.translations[currentLang].title || '',
          content: data.translations[currentLang].content || '',
          shortDescription: data.translations[currentLang].shortDescription || '',
          language: currentLang
        });
      }
    } catch (err) {
      setError('Ошибка при загрузке данных новости');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageChanged(true);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageChanged(true);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleLanguageChange = (langCode) => {
    setTranslations(prev => ({
      ...prev,
      [currentLang]: {
        title: formData.title,
        content: formData.content,
        shortDescription: formData.shortDescription
      }
    }));

    setCurrentLang(langCode);
    
    const langData = translations[langCode] || { title: '', content: '', shortDescription: '' };
    setFormData({
      title: langData.title || '',
      content: langData.content || '',
      shortDescription: langData.shortDescription || '',
      language: langCode
    });
  };

  const updateNewsImage = async () => {
    if (!imageChanged) return;

    const imageFormData = new FormData();
    if (imageFile) {
      imageFormData.append('image', imageFile);
    }

    try {
      const result = await NewsApi.updateNews(id, imageFormData);
      setCurrentImageUrl(result.imageUrl);
      setImageChanged(false);
      setImagePreview(null);
      return result.imageUrl;
    } catch (err) {
      console.error('Error updating image:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Заголовок и содержание обязательны');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit) {
        // Update image first if it was changed
        if (imageChanged) {
          await updateNewsImage();
        }

        // Update current language translation
        await NewsApi.updateNewsTranslation(id, currentLang, {
          title: formData.title,
          content: formData.content,
          shortDescription: formData.shortDescription
        });
        
        // Update other language translations
        for (const [lang, data] of Object.entries(translations)) {
          if (lang !== currentLang && (data.title || data.content)) {
            try {
              await NewsApi.updateNewsTranslation(id, lang, data);
            } catch (err) {
              await NewsApi.addNewsTranslation(id, lang, data);
            }
          }
        }
      } else {
        const newsData = {
          title: formData.title,
          content: formData.content,
          shortDescription: formData.shortDescription,
          language: formData.language,
          image: imageFile
        };
        
        const result = await NewsApi.createNewsDraft(newsData);
        
        for (const [lang, data] of Object.entries(translations)) {
          if (lang !== formData.language && (data.title || data.content)) {
            await NewsApi.addNewsTranslation(result.id, lang, data);
          }
        }
      }

      navigate(ADMIN_ROUTES.NEWS_DRAFTS);
    } catch (err) {
      setError('Ошибка при сохранении новости');
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
            {isEdit ? 'Редактировать новость' : 'Создать новость'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Изменение существующей новости' : 'Создание новой новости'}
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
                    {translations[lang.code] && (translations[lang.code].title || translations[lang.code].content) && (
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
                {/* Заголовок */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Заголовок новости *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Введите заголовок новости"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Привлекательный заголовок поможет привлечь внимание читателей
                  </p>
                </div>

                {/* Краткое описание */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Краткое описание
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Напишите краткое описание для предварительного просмотра..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Это описание будет отображаться в списке новостей (рекомендуется до 150 символов)
                  </p>
                </div>

                {/* Полное содержание */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Полное содержание новости *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={16}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Введите полный текст новости..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Подробное содержание новости. Используйте абзацы для лучшей читаемости
                  </p>
                </div>
              </div>

              {/* Правая боковая панель - 1 колонка */}
              <div className="space-y-6">
                {/* Изображение */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Изображение новости
                  </label>
                  
                  {(currentImageUrl || imagePreview) && (
                    <div className="mb-4 relative group">
                      <img
                        src={imagePreview || currentImageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      {isEdit && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            🗑️ Удалить изображение
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {isEdit && imageChanged && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Изображение будет обновлено при сохранении формы
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <p>• Поддерживаемые форматы: JPG, PNG, WebP, GIF</p>
                    <p>• Максимальный размер: 5MB</p>
                    <p>• Рекомендуемое разрешение: 1200x600px</p>
                    {isEdit && <p>• Выберите новое изображение для замены текущего</p>}
                  </div>
                </div>

                {/* Статус переводов */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Статус переводов</h3>
                  <div className="space-y-3">
                    {languages.map((lang) => (
                      <div key={lang.code} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                        </div>
                        <div className="text-sm">
                          {translations[lang.code] && (translations[lang.code].title || translations[lang.code].content) ? (
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
                    Заполните содержание для всех необходимых языков
                  </p>
                </div>

                {/* Подсказки */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Советы</h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Используйте понятные заголовки</li>
                    <li>• Добавьте качественное изображение</li>
                    <li>• Проверьте переводы на всех языках</li>
                    <li>• Сохраните как черновик для предварительного просмотра</li>
                    {isEdit && <li>• При редактировании можно обновить изображение</li>}
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
                    onClick={() => navigate(ADMIN_ROUTES.NEWS_DRAFTS)}
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

export default AdminNewsForm;