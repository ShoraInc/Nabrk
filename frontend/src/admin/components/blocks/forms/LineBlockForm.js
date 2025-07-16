// components/admin/blocks/forms/LineBlockForm.js
import React, { useState, useEffect } from 'react';
import blocksApi from '../../../../api/blocksApi';

const LineBlockForm = ({ pageId, editingBlock, onSubmit, onCancel, isHidden }) => {
  const isEditing = !!editingBlock;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockOptions, setBlockOptions] = useState(null);
  
  const [formData, setFormData] = useState({
    order: 1,
    color: '#000000',
    height: 1,
    width: '100%',
    style: 'solid',
    marginTop: 0,
    marginBottom: 0,
    isHidden: false, // <-- добавить по умолчанию
  });

  useEffect(() => {
    loadBlockOptions();
  }, []);

  useEffect(() => {
    if (isEditing && editingBlock) {
      const data = editingBlock.data || {};
      setFormData({
        order: editingBlock.order || 0,
        color: data.color || '#000000',
        height: data.height || 1,
        width: data.width || '100%',
        style: data.style || 'solid',
        marginTop: data.marginTop || 0,
        marginBottom: data.marginBottom || 0,
        isHidden: editingBlock.isHidden || false, // <-- исправлено здесь
      });
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

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация с использованием опций из API
    const heightRange = blockOptions?.line?.heightRange;
    const marginRange = blockOptions?.line?.marginRange;

    if (heightRange && (formData.height < heightRange.min || formData.height > heightRange.max)) {
      setError(`Высота линии должна быть от ${heightRange.min} до ${heightRange.max} пикселей`);
      return;
    }

    if (marginRange && (formData.marginTop < marginRange.min || formData.marginTop > marginRange.max)) {
      setError(`Отступ сверху должен быть от ${marginRange.min} до ${marginRange.max} пикселей`);
      return;
    }

    if (marginRange && (formData.marginBottom < marginRange.min || formData.marginBottom > marginRange.max)) {
      setError(`Отступ снизу должен быть от ${marginRange.min} до ${marginRange.max} пикселей`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        const updatedBlock = await blocksApi.updateLineBlock(editingBlock.id, formData);
        onSubmit(updatedBlock);
      } else {
        const blockData = {
          pageId: parseInt(pageId),
          isHidden: isHidden || false, // Добавляем флаг скрытого блока
          ...formData,
        };
        const newBlock = await blocksApi.createLineBlock(blockData);
        onSubmit(newBlock);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error saving line block:', err);
    } finally {
      setLoading(false);
    }
  };

  // Форматируем опции ширины
  const getWidthOptions = () => {
    if (!blockOptions?.line?.width) return [];

    const widthDescriptions = {
      '25%': 'Четверть',
      '50%': 'Половина', 
      '75%': 'Три четверти',
      '100%': 'Полная ширина'
    };

    return blockOptions.line.width.map(width => ({
      value: width,
      label: `${width} - ${widthDescriptions[width] || width}`
    }));
  };

  // Форматируем опции стиля
  const getStyleOptions = () => {
    if (!blockOptions?.line?.style) return [];

    const styleDescriptions = {
      'solid': 'Сплошная',
      'dashed': 'Пунктирная',
      'dotted': 'Точечная'
    };

    return blockOptions.line.style.map(style => ({
      value: style,
      label: styleDescriptions[style] || style
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

      {/* Предпросмотр */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">👁️ Предпросмотр</h4>
        <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300">
          <hr 
            style={{
              width: formData.width,
              height: '0px',
              backgroundColor: 'transparent',
              border: 'none',
              borderTop: `${formData.height}px ${formData.style} ${formData.color}`,
              marginTop: `${formData.marginTop}px`,
              marginBottom: `${formData.marginBottom}px`,
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: 0
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Порядок */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Порядок
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => handleChange('order', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Порядок отображения блока на странице
          </p>
        </div>

        {/* Цвет */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цвет линии
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Высота */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Высота линии (px)
          </label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={blockOptions.line?.heightRange?.min || 1}
            max={blockOptions.line?.heightRange?.max || 20}
          />
          <p className="text-xs text-gray-500 mt-1">
            От {blockOptions.line?.heightRange?.min || 1} до {blockOptions.line?.heightRange?.max || 20} пикселей
          </p>
        </div>

        {/* Ширина */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ширина линии
          </label>
          <select
            value={formData.width}
            onChange={(e) => handleChange('width', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getWidthOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Стиль */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Стиль линии
          </label>
          <select
            value={formData.style}
            onChange={(e) => handleChange('style', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getStyleOptions().map((option) => (
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
            onChange={(e) => handleChange('marginTop', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={blockOptions.line?.marginRange?.min || 0}
            max={blockOptions.line?.marginRange?.max || 200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Отступ снизу (px)
          </label>
          <input
            type="number"
            value={formData.marginBottom}
            onChange={(e) => handleChange('marginBottom', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={blockOptions.line?.marginRange?.min || 0}
            max={blockOptions.line?.marginRange?.max || 200}
          />
        </div>
        {/* Чекбокс скрытого блока — теперь всегда */}
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

// Проверка: используется ли блок как дочерний в FAQ
async function checkBlockUsedInFaq(blockId) {
  return await blocksApi.checkBlockUsedInFaq(blockId);
}

export default LineBlockForm;