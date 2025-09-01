// components/admin/blocks/forms/ButtonBlockForm.js
import React, { useState, useEffect } from 'react';
import blocksApi from '../../../../api/blocksApi';

const ButtonBlockForm = ({ pageId, editingBlock, onSubmit, onCancel, isHidden }) => {
  const isEditing = !!editingBlock;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockOptions, setBlockOptions] = useState(null);

  // Данные формы
  const [formData, setFormData] = useState({
    order: 1,
    url: '',
    width: '100%',
    backgroundColor: '#D4AF37', // Золотистый как на фото
    textColor: '#000000',
    fontWeight: '600', // Средняя жирность по умолчанию
    marginTop: 0,
    marginBottom: 16,
    isHidden: false,
  });

  // Переводы
  const [translations, setTranslations] = useState({});
  const [currentLang, setCurrentLang] = useState('kz');

  useEffect(() => {
    loadBlockOptions();
  }, []);

  useEffect(() => {
    if (isEditing) {
      loadBlockData();
    }
  }, [isEditing, editingBlock]);

  const loadBlockOptions = async () => {
    try {
      const options = await blocksApi.getBlockOptions();
      setBlockOptions(options);
    } catch (err) {
      console.error('Error loading block options:', err);
    }
  };

  const loadBlockData = () => {
    if (!editingBlock) return;

    // Загружаем стили блока
    const data = editingBlock.data || {};
    setFormData({
      order: editingBlock.order || 0,
      url: data.url || '',
      width: data.width || '100%',
      backgroundColor: data.backgroundColor || '#D4AF37',
      textColor: data.textColor || '#000000',
      fontWeight: data.fontWeight || '600',
      marginTop: data.marginTop || 0,
      marginBottom: data.marginBottom || 16,
      isHidden: editingBlock.isHidden || false,
    });

    // Загружаем переводы
    setTranslations(data.translations || {});
  };

  const handleStyleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTranslationChange = (lang, text) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: text
    }));
  };

  const getCurrentTranslation = () => {
    return translations[currentLang] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    const currentText = getCurrentTranslation();
    if (!currentText || !currentText.trim()) {
      setError('Текст для кнопки обязателен');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // При редактировании обновляем стили и переводы отдельно

        // 1. Обновляем стили блока
        await blocksApi.updateButtonBlock(editingBlock.id, formData);

        // 2. Обновляем переводы
        for (const [lang, text] of Object.entries(translations)) {
          if (text && text.trim()) {
            await blocksApi.upsertButtonTranslation(editingBlock.id, lang, text.trim());
          }
        }

        onSubmit();
      } else {
        // При создании
        const blockData = {
          pageId: parseInt(pageId),
          text: currentText.trim(),
          language: currentLang,
          ...formData,
        };

        const newBlock = await blocksApi.createButtonBlock(blockData);

        // Добавляем остальные переводы
        for (const [lang, text] of Object.entries(translations)) {
          if (lang !== currentLang && text && text.trim()) {
            await blocksApi.upsertButtonTranslation(newBlock.id, lang, text.trim());
          }
        }

        onSubmit(newBlock);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving button block:', err);
    } finally {
      setLoading(false);
    }
  };

  // Получаем языки из опций
  const getLanguages = () => {
    if (!blockOptions?.languages) return [];

    const languageNames = {
      'en': 'English',
      'ru': 'Русский',
      'kz': 'Қазақша'
    };

    return blockOptions.languages.map(code => ({
      code,
      name: languageNames[code] || code.toUpperCase()
    }));
  };

  if (!blockOptions) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Загрузка опций...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Переводы */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">📝 Текст кнопки</h4>

        {/* Переключатель языков */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getLanguages().map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setCurrentLang(lang.code)}
              className={`px-3 py-2 rounded font-medium text-sm transition-colors ${currentLang === lang.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
            >
              {lang.name}
              {translations[lang.code] && (
                <span className="ml-1 text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Поле ввода текста */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текст на {getLanguages().find(l => l.code === currentLang)?.name}:
          </label>
          <input
            type="text"
            value={getCurrentTranslation()}
            onChange={(e) => handleTranslationChange(currentLang, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Введите текст кнопки на ${getLanguages().find(l => l.code === currentLang)?.name}...`}
            required={currentLang === 'kz'} // Казахский обязателен
          />
        </div>
      </div>

      {/* Настройки кнопки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Порядок */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Порядок
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => handleStyleChange('order', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ссылка (URL)
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleStyleChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com или /internal-page"
          />
        </div>

        {/* Ширина */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ширина
          </label>
          <select
            value={formData.width}
            onChange={(e) => handleStyleChange('width', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {blockOptions.button?.widthOptions?.map((width) => (
              <option key={width} value={width}>
                {width}
              </option>
            ))}
          </select>
        </div>

        {/* Цвет фона */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цвет фона
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <select
              value={formData.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {blockOptions.button?.backgroundColors?.map((color) => (
                <option key={color} value={color}>
                  {color} {color === '#D4AF37' ? '(золотистый)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Цвет текста */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цвет текста
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.textColor}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <select
              value={formData.textColor}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {blockOptions.button?.textColors?.map((color) => (
                <option key={color} value={color}>
                  {color === '#000000' ? 'Черный' : color === '#FFFFFF' ? 'Белый' : color}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Толщина шрифта */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Толщина шрифта
          </label>
          <select
            value={formData.fontWeight}
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {blockOptions.button?.fontWeights?.map((weight) => (
              <option key={weight} value={weight}>
                {weight === '300' ? 'Тонкий (300)' :
                 weight === '400' ? 'Обычный (400)' :
                 weight === '500' ? 'Средний (500)' :
                 weight === '600' ? 'Полужирный (600)' :
                 weight === '700' ? 'Жирный (700)' :
                 weight === '800' ? 'Очень жирный (800)' : weight}
              </option>
            ))}
          </select>
        </div>

        {/* Отступы */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Отступ сверху (px)
          </label>
          <input
            type="number"
            value={formData.marginTop}
            onChange={(e) => handleStyleChange('marginTop', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={blockOptions.button?.marginRange?.min || 0}
            max={blockOptions.button?.marginRange?.max || 200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Отступ снизу (px)
          </label>
          <input
            type="number"
            value={formData.marginBottom}
            onChange={(e) => handleStyleChange('marginBottom', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={blockOptions.button?.marginRange?.min || 0}
            max={blockOptions.button?.marginRange?.max || 200}
          />
        </div>
      </div>

      {/* Предпросмотр */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Предпросмотр:</h4>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            style={{
              width: formData.width,
              maxWidth: '300px',
              padding: '16px 24px',
              backgroundColor: formData.backgroundColor,
              color: formData.textColor,
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              fontFamily: "'Roboto Flex', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {getCurrentTranslation() || 'Текст кнопки'}
          </button>
        </div>
      </div>

      {/* Чекбокс скрытого блока */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isHidden}
            onChange={e => setFormData(prev => ({ ...prev, isHidden: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-yellow-800">
            Скрытый блок (не будет отображаться на странице)
          </span>
        </label>
        <p className="text-xs text-yellow-600 mt-1">
          Скрытые блоки можно использовать как дочерние элементы для других блоков
        </p>
      </div>

      {/* Кнопки */}
      <div className="flex space-x-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Сохранение...' : (isEditing ? 'Обновить' : 'Создать')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default ButtonBlockForm;
