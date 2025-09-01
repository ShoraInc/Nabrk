// admin/components/blocks/forms/ImageBlockForm.js

import React, { useState, useEffect } from 'react';
import blocksApi from '../../../../api/blocksApi';

const ImageBlockForm = ({ 
  editingBlock = null, 
  isEditing = false, 
  onCancel, 
  onSubmit,
  pageId,
  order 
}) => {
  const [formData, setFormData] = useState({
    displayMode: 'single',
    aspectRatio: 'auto',
    alignment: 'center',
    marginTop: 0,
    marginBottom: 16,
    autoPlay: false,
    showDots: true,
    showArrows: true,
    slideSpeed: 5000,
    isHidden: false
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blockOptions, setBlockOptions] = useState(null);

  useEffect(() => {
    loadBlockOptions();
    if (isEditing && editingBlock) {
      loadBlockData();
    }
  }, [isEditing, editingBlock]);

  const loadBlockOptions = async () => {
    try {
      const response = await blocksApi.getBlockOptions();
      console.log('Block options response:', response);
      setBlockOptions(response.options || response);
    } catch (error) {
      console.error('Error loading block options:', error);
      setError('Ошибка загрузки настроек блока');
    }
  };

  const loadBlockData = () => {
    if (!editingBlock) return;

    const data = editingBlock.data || {};
    setFormData({
      displayMode: data.displayMode || 'single',
      aspectRatio: data.aspectRatio || 'auto',
      alignment: data.alignment || 'center',
      marginTop: data.marginTop || 0,
      marginBottom: data.marginBottom || 16,
      autoPlay: data.sliderOptions?.autoPlay || false,
      showDots: data.sliderOptions?.showDots !== undefined ? data.sliderOptions.showDots : true,
      showArrows: data.sliderOptions?.showArrows !== undefined ? data.sliderOptions.showArrows : true,
      slideSpeed: data.sliderOptions?.slideSpeed || 5000,
      isHidden: data.isHidden || false
    });

    if (data.images) {
      // Добавляем ID к существующим изображениям если их нет
      const imagesWithIds = data.images.map((image, index) => ({
        ...image,
        id: image.id || `existing_${index}_${Date.now()}`
      }));
      setImages(imagesWithIds);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Проверяем общее количество изображений
    const totalImages = images.length + newImages.length + files.length;
    if (totalImages > 10) {
      setError('Максимальное количество изображений: 10');
      return;
    }

    // Проверяем размер файлов
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = files.filter(file => file.size > maxSize);
    if (invalidFiles.length > 0) {
      setError('Некоторые файлы превышают размер 5MB');
      return;
    }

    // Проверяем типы файлов
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const invalidTypes = files.filter(file => !allowedTypes.includes(file.type));
    if (invalidTypes.length > 0) {
      setError('Поддерживаются только изображения: JPG, PNG, WebP, GIF');
      return;
    }

    // Добавляем новые изображения
    const newImageObjects = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: '',
      caption: '',
      id: Date.now() + Math.random() // Временный ID
    }));

    setNewImages(prev => [...prev, ...newImageObjects]);
    setError('');
  };

  const updateImageData = (imageId, field, value, isExisting = false) => {
    if (isExisting) {
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, [field]: value } : img
      ));
    } else {
      setNewImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, [field]: value } : img
      ));
    }
  };

  const removeImage = (imageId, isExisting = false) => {
    if (isExisting) {
      setImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      setNewImages(prev => {
        const imageToRemove = prev.find(img => img.id === imageId);
        if (imageToRemove && imageToRemove.preview) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
        return prev.filter(img => img.id !== imageId);
      });
    }
  };

  const getImageUrl = (image) => {
    if (image.preview) return image.preview;
    if (image.url) {
      const baseUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
      return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0 && newImages.length === 0) {
      setError('Добавьте хотя бы одно изображение');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const blockData = {
        pageId: pageId,
        order: order || 0,
        displayMode: formData.displayMode,
        aspectRatio: formData.aspectRatio,
        alignment: formData.alignment,
        marginTop: parseInt(formData.marginTop) || 0,
        marginBottom: parseInt(formData.marginBottom) || 16,
        autoPlay: formData.autoPlay,
        showDots: formData.showDots,
        showArrows: formData.showArrows,
        slideSpeed: parseInt(formData.slideSpeed) || 5000,
        isHidden: formData.isHidden,
        images: newImages
      };

      console.log('Submitting image block:', { isEditing, blockData, existingImages: images.length, newImages: newImages.length });

      if (isEditing) {
        blockData.keepExistingImages = images.length > 0;
        console.log('Updating image block:', editingBlock.id, blockData);
        const result = await blocksApi.updateImageBlock(editingBlock.id, blockData);
        console.log('Update result:', result);
        onSubmit(result.block);
      } else {
        console.log('Creating image block:', blockData);
        const result = await blocksApi.createImageBlock(blockData);
        console.log('Create result:', result);
        onSubmit(result.block);
      }
    } catch (error) {
      console.error('Error saving image block:', error);
      setError(error.message || 'Ошибка при сохранении блока');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      newImages.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Редактировать изображения' : 'Добавить изображения'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Создайте галерею, слайдер или добавьте одно изображение
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Загрузка изображений */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Изображения
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-gray-600">Нажмите для выбора изображений</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP, GIF до 5MB (максимум 10 изображений)</p>
            </label>
          </div>
        </div>

        {/* Существующие изображения */}
        {images.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Текущие изображения</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={image.id || index} className="relative group">
                  <img
                    src={getImageUrl(image)}
                    alt={image.alt || ''}
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      console.error('Failed to load image:', getImageUrl(image));
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback если изображение не загрузилось */}
                  <div 
                    style={{ display: 'none' }}
                    className="w-full h-32 bg-gray-200 rounded-lg border flex items-center justify-center"
                  >
                    <span className="text-gray-500 text-sm">Ошибка загрузки</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id || index, true)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    placeholder="Alt текст"
                    value={image.alt || ''}
                    onChange={(e) => updateImageData(image.id || index, 'alt', e.target.value, true)}
                    className="mt-1 w-full text-xs px-2 py-1 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Подпись"
                    value={image.caption || ''}
                    onChange={(e) => updateImageData(image.id || index, 'caption', e.target.value, true)}
                    className="mt-1 w-full text-xs px-2 py-1 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Новые изображения */}
        {newImages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Новые изображения</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {newImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.preview}
                    alt={image.alt || ''}
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      console.error('Failed to load preview image:', image.preview);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback если изображение не загрузилось */}
                  <div 
                    style={{ display: 'none' }}
                    className="w-full h-32 bg-gray-200 rounded-lg border flex items-center justify-center"
                  >
                    <span className="text-gray-500 text-sm">Ошибка загрузки</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    placeholder="Alt текст"
                    value={image.alt}
                    onChange={(e) => updateImageData(image.id, 'alt', e.target.value)}
                    className="mt-1 w-full text-xs px-2 py-1 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Подпись"
                    value={image.caption}
                    onChange={(e) => updateImageData(image.id, 'caption', e.target.value)}
                    className="mt-1 w-full text-xs px-2 py-1 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Настройки отображения */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Режим отображения */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Режим отображения
            </label>
            <select
              value={formData.displayMode}
              onChange={(e) => handleInputChange('displayMode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(blockOptions?.image?.displayModes || ['single', 'gallery', 'slider']).map((mode) => (
                <option key={mode} value={mode}>
                  {mode === 'single' ? 'Одно изображение' :
                   mode === 'gallery' ? 'Галерея' :
                   mode === 'slider' ? 'Слайдер' : mode}
                </option>
              ))}
            </select>
          </div>

          {/* Соотношение сторон */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Соотношение сторон
            </label>
            <select
              value={formData.aspectRatio}
              onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(blockOptions?.image?.aspectRatios || ['auto', '16:9', '4:3', '1:1', '3:2']).map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio === 'auto' ? 'Авто' : ratio}
                </option>
              ))}
            </select>
          </div>

          {/* Выравнивание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выравнивание
            </label>
            <select
              value={formData.alignment}
              onChange={(e) => handleInputChange('alignment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(blockOptions?.image?.alignments || ['left', 'center', 'right']).map((align) => (
                <option key={align} value={align}>
                  {align === 'left' ? 'По левому краю' :
                   align === 'center' ? 'По центру' :
                   align === 'right' ? 'По правому краю' : align}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Настройки слайдера (только для slider режима) */}
        {formData.displayMode === 'slider' && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Настройки слайдера</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoPlay"
                  checked={formData.autoPlay}
                  onChange={(e) => handleInputChange('autoPlay', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoPlay" className="text-sm text-gray-700">
                  Автопроигрывание
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showDots"
                  checked={formData.showDots}
                  onChange={(e) => handleInputChange('showDots', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showDots" className="text-sm text-gray-700">
                  Показать точки
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showArrows"
                  checked={formData.showArrows}
                  onChange={(e) => handleInputChange('showArrows', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showArrows" className="text-sm text-gray-700">
                  Показать стрелки
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Скорость (мс)
                </label>
                <select
                  value={formData.slideSpeed}
                  onChange={(e) => handleInputChange('slideSpeed', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(blockOptions?.image?.sliderOptions?.slideSpeed || [3000, 5000, 8000, 10000]).map((speed) => (
                    <option key={speed} value={speed}>
                      {speed / 1000}с
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

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
              onChange={(e) => handleInputChange('marginTop', parseInt(e.target.value) || 0)}
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
              onChange={(e) => handleInputChange('marginBottom', parseInt(e.target.value) || 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Скрыть блок */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isHidden"
            checked={formData.isHidden}
            onChange={(e) => handleInputChange('isHidden', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isHidden" className="text-sm text-gray-700">
            Скрыть блок (не отображать на сайте)
          </label>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading || (images.length === 0 && newImages.length === 0)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Сохранение...' : (isEditing ? 'Обновить' : 'Создать')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageBlockForm;
