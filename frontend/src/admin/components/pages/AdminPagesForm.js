// components/admin/AdminPagesForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pagesApi from '../../../api/pagesApi';
import AdminSidebar from '../shared/AdminSidebar';
import { ADMIN_ROUTES } from '../../../routes/constants';

const AdminPagesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [slugError, setSlugError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadPage();
    }
  }, [id, isEdit]);

  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);
      const page = await pagesApi.getPageByIdAdmin(id);
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        status: page.status || 'draft'
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading page:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[а-я]/g, (char) => {
        const translit = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return translit[char] || char;
      })
      .replace(/[^a-z0-9\-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title
    }));

    // Автогенерация slug только при создании новой страницы
    if (!isEdit && title) {
      const newSlug = generateSlug(title);
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
    }
  };

  const handleSlugChange = (e) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, '-');
    setFormData(prev => ({
      ...prev,
      slug
    }));
    setSlugError(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Название страницы обязательно');
      return false;
    }

    if (!formData.slug.trim()) {
      setError('Slug обязателен');
      return false;
    }

    if (formData.slug.length < 3) {
      setSlugError('Slug должен содержать минимум 3 символа');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEdit) {
        await pagesApi.updatePage(id, formData);
      } else {
        await pagesApi.createPage(formData);
      }

      navigate(ADMIN_ROUTES.PAGES_DRAFTS);
    } catch (err) {
      setError(err.message);
      console.error('Error saving page:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(ADMIN_ROUTES.PAGES_DRAFTS);
  };

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? 'ml-64' : 'ml-16'
  }`;

  if (loading) {
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
            {isEdit ? 'Редактировать страницу' : 'Создать страницу'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Изменение существующей страницы' : 'Создание новой страницы'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Основные поля - 2 колонки */}
              <div className="xl:col-span-2 space-y-6">
                {/* Название страницы */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Название страницы *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Введите название страницы"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Привлекательное название поможет пользователям найти страницу
                  </p>
                </div>

                {/* URL Slug */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    URL Slug *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="bg-gray-100 px-4 py-3 text-gray-600 font-medium border-r border-gray-300">
                      /
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={handleSlugChange}
                      className={`flex-1 px-4 py-3 focus:outline-none ${slugError ? 'border-red-500' : ''}`}
                      placeholder="url-slug"
                      required
                    />
                  </div>
                  {slugError && (
                    <div className="mt-2 text-sm text-red-600">
                      {slugError}
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    Slug используется в URL страницы. Только латинские буквы, цифры и дефисы.
                  </div>
                </div>

                {/* Статус */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Статус
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликован</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Черновики видны только в админ-панели, опубликованные - всем пользователям
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">🔗 Предпросмотр URL</h3>
                  <div className="bg-white p-3 rounded border">
                    <span className="text-blue-600 font-mono">
                      {window.location.origin}/page/{formData.slug || 'url-slug'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Правая боковая панель - 1 колонка */}
              <div className="space-y-6">
                {/* Информация о странице */}
                {isEdit && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Информация</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium">{id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Статус:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          formData.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {formData.status === 'published' ? 'Опубликован' : 'Черновик'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Следующие шаги */}
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Следующие шаги</h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    {isEdit ? (
                      <>
                        <li>• Обновите информацию о странице</li>
                        <li>• Добавьте или отредактируйте блоки контента</li>
                        <li>• Опубликуйте страницу для пользователей</li>
                      </>
                    ) : (
                      <>
                        <li>• Сохраните базовую информацию</li>
                        <li>• Добавьте блоки контента (заголовки, текст, изображения)</li>
                        <li>• Опубликуйте страницу</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Подсказки */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Советы</h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Используйте понятные названия страниц</li>
                    <li>• Slug должен быть коротким и описательным</li>
                    <li>• Сначала создайте страницу, потом добавляйте контент</li>
                    <li>• Для публикации нужен хотя бы один блок</li>
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
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Сохранение...
                      </>
                    ) : (
                      isEdit ? '💾 Сохранить изменения' : '📝 Создать страницу'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
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

export default AdminPagesForm;