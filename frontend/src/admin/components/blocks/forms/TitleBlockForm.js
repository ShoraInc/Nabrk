// components/admin/blocks/forms/TitleBlockForm.js
import React, { useState, useEffect } from 'react';
import blocksApi from '../../../../api/blocksApi';

const TitleBlockForm = ({ pageId, editingBlock, onSubmit, onCancel }) => {
  const isEditing = !!editingBlock;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockOptions, setBlockOptions] = useState(null);
  
  // Данные формы
  const [formData, setFormData] = useState({
    order: 1,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
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
      fontSize: data.fontSize || '24px',
      fontWeight: data.fontWeight || '600',
      color: data.color || '#333333',
      textAlign: data.textAlign || 'center',
      marginTop: data.marginTop || 0,
      marginBottom: data.marginBottom || 0,
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
      setError('Текст для текущего языка обязателен');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // При редактировании обновляем стили и переводы отдельно
        
        // 1. Обновляем стили блока
        await blocksApi.updateTitleBlock(editingBlock.id, formData);
        
        // 2. Обновляем переводы
        for (const [lang, text] of Object.entries(translations)) {
          if (text && text.trim()) {
            await blocksApi.upsertTitleTranslation(editingBlock.id, lang, text.trim());
          }
        }

        onSubmit();
      } else {
        // При создании
        const blockData = {
          pageId: parseInt(pageId),
          text: currentText.trim(),
          language: currentLang,
          ...formData
        };

        const newBlock = await blocksApi.createTitleBlock(blockData);
        
        // Добавляем остальные переводы
        for (const [lang, text] of Object.entries(translations)) {
          if (lang !== currentLang && text && text.trim()) {
            await blocksApi.upsertTitleTranslation(newBlock.id, lang, text.trim());
          }
        }

        onSubmit(newBlock);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving title block:', err);
    } finally {
      setLoading(false);
    }
  };

  // Получаем языки из опций
  const getLanguages = () => {
    if (!blockOptions?.languages) return [];
    
    const languageNames = {
      'kz': 'Қазақша',
      'ru': 'Русский', 
      'en': 'English',
      'qaz': 'Qazaqsha'
    };

    return blockOptions.languages.map(code => ({
      code,
      name: languageNames[code] || code.toUpperCase()
    }));
  };

  // Форматируем размеры шрифтов с описаниями
  const getFontSizeOptions = () => {
    if (!blockOptions?.title?.fontSize) return [];

    const sizeDescriptions = {
      '10px': 'Микротекст',
      '12px': 'Мелкий',
      '14px': 'Маленький',
      '16px': 'Обычный',
      '18px': 'Средний',
      '20px': 'Большой',
      '24px': 'Крупный',
      '28px': 'Очень крупный',
      '32px': 'Подзаголовок',
      '36px': 'Заголовок H4',
      '40px': 'Заголовок H3',
      '44px': 'Заголовок H2',
      '48px': 'Заголовок H1',
      '56px': 'Большой герой',
      '64px': 'Мега заголовок',
      '72px': 'Супер большой',
      '96px': 'Колоссальный',
      '120px': 'Титанический'
    };

    return blockOptions.title.fontSize.map(size => ({
      value: size,
      label: `${size} - ${sizeDescriptions[size] || 'Большой'}`
    }));
  };

  // Форматируем толщину шрифтов
  const getFontWeightOptions = () => {
    if (!blockOptions?.title?.fontWeight) return [];

    const weightDescriptions = {
      '100': 'Сверхтонкий',
      '200': 'Тонкий',
      '300': 'Легкий',
      '400': 'Обычный',
      '500': 'Средний',
      '600': 'Полужирный',
      '700': 'Жирный',
      '800': 'Очень жирный',
      '900': 'Сверхжирный'
    };

    return blockOptions.title.fontWeight.map(weight => ({
      value: weight,
      label: `${weight} - ${weightDescriptions[weight] || 'Жирный'}`
    }));
  };

  // Форматируем выравнивание
  const getTextAlignOptions = () => {
    if (!blockOptions?.title?.textAlign) return [];

    const alignDescriptions = {
      'left': 'По левому краю',
      'center': 'По центру',
      'right': 'По правому краю',
      'justify': 'По ширине'
    };

    return blockOptions.title.textAlign.map(align => ({
      value: align,
      label: alignDescriptions[align] || align
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
        <h4 className="font-semibold text-gray-800 mb-4">📝 Переводы текста</h4>
        
        {/* Переключатель языков */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getLanguages().map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setCurrentLang(lang.code)}
              className={`px-3 py-2 rounded font-medium text-sm transition-colors ${
                currentLang === lang.code
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
          <textarea
            value={getCurrentTranslation()}
            onChange={(e) => handleTranslationChange(currentLang, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder={`Введите текст на ${getLanguages().find(l => l.code === currentLang)?.name}...`}
            required={currentLang === 'kz'} // Казахский обязателен
          />
        </div>
      </div>

      {/* Стили */}
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

        {/* Размер шрифта */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Размер шрифта
          </label>
          <select
            value={formData.fontSize}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getFontSizeOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            {getFontWeightOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Цвет */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цвет текста
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#333333"
            />
          </div>
        </div>

        {/* Выравнивание */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выравнивание
          </label>
          <select
            value={formData.textAlign}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getTextAlignOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
            min={blockOptions.title?.marginRange?.min || 0}
            max={blockOptions.title?.marginRange?.max || 200}
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
            min={blockOptions.title?.marginRange?.min || 0}
            max={blockOptions.title?.marginRange?.max || 200}
          />
        </div>
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

export default TitleBlockForm;