// components/admin/blocks/forms/TextImageBlockForm.js
import React, { useState, useEffect } from 'react';
import blocksApi from '../../../../api/blocksApi';

const TextImageBlockForm = ({ pageId, editingBlock, onSubmit, onCancel, isHidden }) => {
  const isEditing = !!editingBlock;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockOptions, setBlockOptions] = useState(null);

  // Данные формы
  const [formData, setFormData] = useState({
    order: 1,
    imagePosition: 'left',
    marginTop: 0,
    marginBottom: 16,
    isHidden: false,
  });

  // Переводы
  const [translations, setTranslations] = useState({});
  const [currentLang, setCurrentLang] = useState('kz');

  // Изображение
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

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
      imagePosition: data.imagePosition || 'left',
      marginTop: data.marginTop || 0,
      marginBottom: data.marginBottom || 16,
      isHidden: editingBlock.isHidden || false,
    });

    // Загружаем переводы
    setTranslations(data.translations || {});

    // Загружаем существующее изображение
    if (data.imageUrl) {
      setExistingImageUrl(data.imageUrl);
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Создаем preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация - должен быть хотя бы текст или изображение
    const currentText = getCurrentTranslation();
    if (!currentText?.trim() && !selectedImage && !existingImageUrl) {
      setError('Необходимо указать текст или загрузить изображение');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Подготавливаем FormData для отправки
      const formDataToSend = new FormData();

      if (isEditing) {
        // При редактировании обновляем стили
        formDataToSend.append('order', formData.order);
        formDataToSend.append('imagePosition', formData.imagePosition);
        formDataToSend.append('marginTop', formData.marginTop);
        formDataToSend.append('marginBottom', formData.marginBottom);
        formDataToSend.append('isHidden', formData.isHidden);

        // Добавляем новое изображение, если выбрано
        if (selectedImage) {
          formDataToSend.append('image', selectedImage);
        }

        // Обновляем блок
        await blocksApi.updateTextImageBlock(editingBlock.id, formDataToSend);

        // Обновляем переводы
        for (const [lang, text] of Object.entries(translations)) {
          if (text && text.trim()) {
            await blocksApi.upsertTextImageTranslation(editingBlock.id, lang, text.trim());
          }
        }

        onSubmit();
      } else {
        // При создании
        formDataToSend.append('pageId', parseInt(pageId));
        formDataToSend.append('text', currentText.trim());
        formDataToSend.append('language', currentLang);
        formDataToSend.append('order', formData.order);
        formDataToSend.append('imagePosition', formData.imagePosition);
        formDataToSend.append('marginTop', formData.marginTop);
        formDataToSend.append('marginBottom', formData.marginBottom);
        formDataToSend.append('isHidden', formData.isHidden);

        // Добавляем изображение, если выбрано
        if (selectedImage) {
          formDataToSend.append('image', selectedImage);
        }

        const newBlock = await blocksApi.createTextImageBlock(formDataToSend);

        // Добавляем остальные переводы
        for (const [lang, text] of Object.entries(translations)) {
          if (lang !== currentLang && text && text.trim()) {
            await blocksApi.upsertTextImageTranslation(newBlock.id, lang, text.trim());
          }
        }

        onSubmit(newBlock);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving text-image block:', err);
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

  // Получаем опции позиций изображения
  const getImagePositionOptions = () => {
    if (!blockOptions?.['text-image']?.imagePosition) return [];

    const positionNames = {
      'left': 'Слева от текста',
      'right': 'Справа от текста'
    };

    return blockOptions['text-image'].imagePosition.map(position => ({
      value: position,
      label: positionNames[position] || position
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

      {/* Изображение */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">🖼️ Изображение</h4>

        {/* Предпросмотр существующего или нового изображения */}
        {(imagePreview || existingImageUrl) && (
          <div className="mb-4">
            <img 
              src={imagePreview || existingImageUrl} 
              alt="Preview" 
              style={{
                maxWidth: '300px',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid #e5e7eb'
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              className="ml-2 mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Удалить
            </button>
          </div>
        )}

        {/* Загрузка нового изображения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {existingImageUrl ? 'Заменить изображение:' : 'Загрузить изображение:'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Поддерживаются форматы: JPEG, PNG, WebP, GIF, SVG. Максимальный размер: 10MB
          </p>
        </div>
      </div>

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
          <textarea
            value={getCurrentTranslation()}
            onChange={(e) => handleTranslationChange(currentLang, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder={`Введите текст на ${getLanguages().find(l => l.code === currentLang)?.name}...`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Текст будет отображаться рядом с изображением
          </p>
        </div>
      </div>

      {/* Настройки */}
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

        {/* Позиция изображения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Позиция изображения
          </label>
          <select
            value={formData.imagePosition}
            onChange={(e) => handleStyleChange('imagePosition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getImagePositionOptions().map((option) => (
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
            min={blockOptions['text-image']?.marginRange?.min || 0}
            max={blockOptions['text-image']?.marginRange?.max || 200}
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
            min={blockOptions['text-image']?.marginRange?.min || 0}
            max={blockOptions['text-image']?.marginRange?.max || 200}
          />
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
          Скрытые блоки можно использовать как дочерние элементы для других блоков (например, в FAQ)
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

export default TextImageBlockForm;
