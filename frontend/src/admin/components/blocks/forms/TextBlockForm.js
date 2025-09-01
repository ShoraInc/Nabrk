import React, { useState, useEffect } from 'react';
import blocksApi from '../../../../api/blocksApi';

const TextBlockForm = ({ 
  pageId, 
  editingBlock, 
  onSubmit, 
  onCancel 
}) => {
  const isEditing = !!editingBlock;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockOptions, setBlockOptions] = useState(null);

  // Данные формы
  const [formData, setFormData] = useState({
    order: 1,
    fontSize: '16px',
    fontWeight: '400',
    textColor: '#000000',
    textAlign: 'left',
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
      const response = await blocksApi.getBlockOptions();
      console.log('Block options response:', response); // Отладка
      setBlockOptions(response.options || response); // Пробуем оба варианта
    } catch (error) {
      console.error('Error loading block options:', error);
      setError('Ошибка загрузки настроек блока');
    }
  };

  const loadBlockData = () => {
    if (!editingBlock) return;

    // Загружаем стили блока
    const data = editingBlock.data || {};
    setFormData({
      order: editingBlock.order || 0,
      fontSize: data.fontSize || '16px',
      fontWeight: data.fontWeight || '400',
      textColor: data.textColor || '#000000',
      textAlign: data.textAlign || 'left',
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

  const handleTranslationChange = (lang, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем что есть хотя бы один перевод
    const hasTranslations = Object.values(translations).some(text => text && text.trim());
    if (!hasTranslations) {
      setError('Необходимо заполнить текст хотя бы на одном языке');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const blockData = {
        pageId: parseInt(pageId),
        text: translations[currentLang] || Object.values(translations).find(Boolean) || '',
        language: currentLang,
        fontSize: formData.fontSize,
        fontWeight: formData.fontWeight,
        textColor: formData.textColor,
        textAlign: formData.textAlign,
        marginTop: formData.marginTop,
        marginBottom: formData.marginBottom,
        isHidden: formData.isHidden,
      };

      let result;
      if (isEditing) {
        // Обновляем блок
        result = await blocksApi.updateTextBlock(editingBlock.id, formData);
        
        // Обновляем переводы
        for (const [lang, text] of Object.entries(translations)) {
          if (text && text.trim()) {
            await blocksApi.upsertTextTranslation(editingBlock.id, lang, text);
          }
        }
      } else {
        // Создаем новый блок
        result = await blocksApi.createTextBlock(blockData);
        
        // Добавляем дополнительные переводы
        const blockId = result.block.id;
        for (const [lang, text] of Object.entries(translations)) {
          if (lang !== currentLang && text && text.trim()) {
            await blocksApi.upsertTextTranslation(blockId, lang, text);
          }
        }
      }

      onSubmit && onSubmit(result);
    } catch (error) {
      console.error('Error saving text block:', error);
      setError(`Ошибка сохранения: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const languageNames = {
    en: 'English',
    ru: 'Русский', 
    kz: 'Қазақша'
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Переводы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Переводы текста
            </label>
            
            {/* Переключатель языков */}
            <div className="flex space-x-2 mb-3">
              {Object.entries(languageNames).map(([lang, name]) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setCurrentLang(lang)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    currentLang === lang
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Поле ввода текста */}
            <textarea
              value={translations[currentLang] || ''}
              onChange={(e) => handleTranslationChange(currentLang, e.target.value)}
              placeholder={`Введите текст на ${languageNames[currentLang]}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              rows={5}
            />
            
            {/* Показываем переводы на других языках */}
            <div className="mt-2 text-xs text-gray-500">
              Переводы: {Object.entries(translations)
                .filter(([lang, text]) => text && text.trim())
                .map(([lang]) => languageNames[lang])
                .join(', ') || 'Нет'}
            </div>
          </div>

          {/* Стили текста */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {(blockOptions?.text?.fontSizes || ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']).map((size) => (
                  <option key={size} value={size}>
                    {size}
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
                {(blockOptions?.text?.fontWeights || ['300', '400', '500', '600', '700', '800']).map((weight) => (
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
                  {(blockOptions?.text?.textColors || ['#000000', '#333333', '#666666', '#999999', '#D4AF37', '#B8860B', '#FFFFFF', '#EF4444', '#10B981', '#3B82F6']).map((color) => (
                    <option key={color} value={color}>
                      {color === '#000000' ? 'Черный' :
                       color === '#333333' ? 'Темно-серый' :
                       color === '#666666' ? 'Серый' :
                       color === '#999999' ? 'Светло-серый' :
                       color === '#D4AF37' ? 'Золотистый' :
                       color === '#B8860B' ? 'Темно-золотистый' :
                       color === '#FFFFFF' ? 'Белый' :
                       color === '#EF4444' ? 'Красный' :
                       color === '#10B981' ? 'Зеленый' :
                       color === '#3B82F6' ? 'Синий' : color}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Выравнивание текста */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выравнивание
              </label>
              <select
                value={formData.textAlign}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(blockOptions?.text?.textAlign || ['left', 'center', 'right', 'justify']).map((align) => (
                  <option key={align} value={align}>
                    {align === 'left' ? 'По левому краю' :
                     align === 'center' ? 'По центру' :
                     align === 'right' ? 'По правому краю' :
                     align === 'justify' ? 'По ширине' : align}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Отступы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Отступ сверху (px)
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={formData.marginTop}
                onChange={(e) => handleStyleChange('marginTop', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Отступ снизу (px)
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={formData.marginBottom}
                onChange={(e) => handleStyleChange('marginBottom', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Превью */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Превью</h3>
            <div 
              style={{
                fontSize: formData.fontSize,
                fontWeight: formData.fontWeight,
                color: formData.textColor,
                textAlign: formData.textAlign,
                marginTop: `${formData.marginTop}px`,
                marginBottom: `${formData.marginBottom}px`,
                fontFamily: "'Roboto Flex', sans-serif",
                lineHeight: '1.6',
                wordWrap: 'break-word',
              }}
            >
              {translations[currentLang] || 'Введите текст для превью...'}
            </div>
          </div>

          {/* Чекбокс скрытого блока */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isHidden"
              checked={formData.isHidden}
              onChange={(e) => handleStyleChange('isHidden', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isHidden" className="ml-2 block text-sm text-gray-900">
              Скрыть блок (не отображать на сайте)
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : (isEditing ? 'Обновить' : 'Создать')}
            </button>
          </div>
        </form>
    </div>
  );
};

export default TextBlockForm;
