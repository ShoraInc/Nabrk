// admin/components/blocks/forms/ContactInfoBlockForm.js
import React, { useState, useEffect } from "react";
import contactInfoApi from "../../../../api/contactInfoApi";
import blocksApi from '../../../../api/blocksApi';

// Проверка: используется ли блок как дочерний в FAQ
async function checkBlockUsedInFaq(blockId) {
  return await blocksApi.checkBlockUsedInFaq(blockId);
}

const ContactInfoBlockForm = ({ pageId, editingBlock, onSubmit, onCancel, isHidden }) => {
  const isEditing = !!editingBlock;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableIcons, setAvailableIcons] = useState([]);
  const [blockOptions, setBlockOptions] = useState(null);
  const [block, setBlock] = useState(null);
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: {
      kz: "",
      ru: "",
      en: "",
    },
    settings: {
      showTitle: true,
      itemSpacing: "normal",
      iconSize: "medium",
    },
    backgroundColor: "#FFFFFF", // Белый по умолчанию
    isHidden: false, // <-- добавить по умолчанию
  });

  const [newItemData, setNewItemData] = useState({
    type: "text",
    icon: "info",
    text: "",
    value: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // Состояние для переводов заголовка на все языки
  const [titleTranslations, setTitleTranslations] = useState({});
  const [currentLang, setCurrentLang] = useState('kz');

  useEffect(() => {
    loadAvailableIcons();
    loadBlockOptions();

    if (isEditing && editingBlock) {
      loadBlockData();
    } else {
      // При создании — инициализируем пустыми переводами для всех языков
      const emptyTranslations = {};
      Object.keys(formData.title).forEach(lang => { emptyTranslations[lang] = ""; });
      setTitleTranslations(emptyTranslations);
    }
  }, [isEditing, editingBlock]);

  const loadAvailableIcons = async () => {
    try {
      const data = await contactInfoApi.getAvailableIcons();

      // Создаем список иконок включая пользовательские иконки из ПК
      const allIcons = [
        // Основные контакты
        { value: "phone", label: "Телефон", emoji: "📞" },
        {
          value: "figma-phone",
          label: "Телефон (иконка)",
          icon: "/assets/icons/PhoneIcon.png",
        },
        { value: "smartphone", label: "Мобильный", emoji: "📱" },
        { value: "mail", label: "Email", emoji: "📧" },
        {
          value: "figma-email",
          label: "Email (иконка)",
          icon: "/assets/icons/EmailIcon.png",
        },
        { value: "map-pin", label: "Адрес", emoji: "📍" },
        {
          value: "figma-location",
          label: "Адрес (иконка)",
          icon: "/assets/icons/AddressIcon.png",
        },
        { value: "globe", label: "Сайт", emoji: "🌐" },
        {
          value: "figma-website",
          label: "Сайт (иконка)",
          icon: "/assets/icons/XIcon.png",
        },
        { value: "printer", label: "Факс", emoji: "📠" },
        {
          value: "figma-fax",
          label: "Факс (иконка)",
          icon: "/assets/icons/Printer.png",
        },

        // Социальные сети и мессенджеры
        {
          value: "figma-whatsapp",
          label: "WhatsApp",
          icon: "/assets/icons/Bus.png",
        },
        {
          value: "figma-telegram",
          label: "Telegram",
          icon: "/assets/icons/FacebookIcon.png",
        },
        {
          value: "figma-instagram",
          label: "Instagram",
          icon: "/assets/icons/InstagramIcon.png",
        },
        {
          value: "figma-facebook",
          label: "Facebook",
          icon: "/assets/icons/FacebookIcon.png",
        },
        {
          value: "figma-linkedin",
          label: "LinkedIn",
          icon: "/assets/icons/YoutubeIcon.png",
        },
        {
          value: "figma-youtube",
          label: "YouTube",
          icon: "/assets/icons/YoutubeIcon.png",
        },
        {
          value: "figma-youtubeLogo",
          label: "YouTube Logo",
          icon: "/assets/icons/YoutubeLogo.png",
        },

        // Документы и файлы
        { value: "file-text", label: "Документ", emoji: "📄" },
        {
          value: "figma-file",
          label: "Файл (иконка)",
          icon: "/assets/icons/FilePdf.png",
        },
        { value: "file-pdf", label: "PDF", emoji: "📋" },
        { value: "download", label: "Скачать", emoji: "⬇️" },
        {
          value: "figma-download",
          label: "Скачать (иконка)",
          icon: "/assets/icons/Info.png",
        },
        { value: "external-link", label: "Ссылка", emoji: "🔗" },

        // Информация и навигация
        { value: "info", label: "Информация", emoji: "ℹ️" },
        {
          value: "figma-info",
          label: "Информация (иконка)",
          icon: "/assets/icons/Info.png",
        },
        { value: "user", label: "Контактное лицо", emoji: "👤" },
        {
          value: "figma-user",
          label: "Пользователь (иконка)",
          icon: "/assets/icons/UserIcon.png",
        },
        { value: "home", label: "Дом", emoji: "🏠" },
        { value: "building", label: "Офис", emoji: "🏢" },
        {
          value: "figma-building",
          label: "Здание (иконка)",
          icon: "/assets/icons/Printer.png",
        },

        // Дополнительные полезные
        { value: "message-circle", label: "Сообщение", emoji: "💬" },
        { value: "send", label: "Отправить", emoji: "📤" },
        { value: "location", label: "Местоположение", emoji: "🗺️" },

        // Дополнительные иконки из файлов
        { value: "file-doc", label: "DOC документ", emoji: "📄" },
        { value: "file-excel", label: "Excel файл", emoji: "📊" },
        { value: "file-image", label: "Изображение", emoji: "🖼️" },
        { value: "folder", label: "Папка", emoji: "📁" },
      ];

      setAvailableIcons(allIcons);
    } catch (err) {
      console.error("Error loading icons:", err);
    }
  };

  const loadBlockOptions = async () => {
    try {
      const options = await blocksApi.getBlockOptions();
      setBlockOptions(options);
    } catch (err) {
      console.error('Error loading block options:', err);
    }
  };

  // Функция для получения иконки (поддерживаем эмодзи, пользовательские иконки из Figma и URL)
  const getIconEmoji = (iconKey) => {
    const iconMap = {
      // Стандартные эмодзи
      user: "👤",
      person: "👤",
      phone: "📞",
      smartphone: "📞",
      mobile: "📞",
      call: "📞",
      printer: "🖨️",
      fax: "🖨️",
      mail: "✉️",
      email: "✉️",
      envelope: "✉️",
      "map-pin": "📍",
      location: "📍",
      globe: "🌐",
      web: "🌐",
      "file-text": "📄",
      "file-pdf": "📋",
      "external-link": "🔗",
      download: "⬇️",
      info: "ℹ️",
      home: "🏠",
      building: "🏢",
      "message-circle": "💬",
      send: "📤",
      link: "🔗",
      "file-doc": "📄",
      "file-excel": "📊",
      "file-image": "🖼️",
      folder: "📁",

      // Пользовательские иконки из Figma через /assets/icons/
      "figma-phone": "/assets/icons/PhoneIcon.png",
      "figma-email": "/assets/icons/EmailIcon.png",
      "figma-location": "/assets/icons/AddressIcon.png",
      "figma-website": "/assets/icons/XIcon.png",
      "figma-whatsapp": "/assets/icons/Bus.png",
      "figma-telegram": "/assets/icons/FacebookIcon.png",
      "figma-instagram": "/assets/icons/InstagramIcon.png",
      "figma-facebook": "/assets/icons/FacebookIcon.png",
      "figma-linkedin": "/assets/icons/YoutubeIcon.png",
      "figma-youtube": "/assets/icons/YoutubeIcon.png",
      "figma-user": "/assets/icons/UserIcon.png",
      "figma-building": "/assets/icons/Printer.png",
      "figma-fax": "/assets/icons/Printer.png",
      "figma-file": "/assets/icons/FilePdf.png",
      "figma-download": "/assets/icons/Info.png",
      "figma-info": "/assets/icons/Info.png",
      "figma-youtubeLogo": "/assets/icons/YoutubeLogo.png",
    };
    return iconMap[iconKey] || "👤";
  };

  // Проверяем, является ли иконка URL
  const isCustomIcon = (iconValue) => {
    return (
      typeof iconValue === "string" &&
      (iconValue.startsWith("http://") ||
        iconValue.startsWith("https://") ||
        iconValue.startsWith("data:image/") ||
        iconValue.startsWith("/assets/"))
    );
  };

  // Рендерим иконку для формы
  const renderIcon = (iconKey) => {
    const iconValue = getIconEmoji(iconKey);
    if (isCustomIcon(iconValue)) {
      return (
        <div className="flex items-center">
          <img
            src={iconValue}
            alt={iconKey}
            className="w-4 h-4 object-contain mr-2"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(77%) sepia(86%) saturate(364%) hue-rotate(4deg) brightness(96%) contrast(94%)",
            }}
            onError={(e) => {
              // Если иконка не загрузилась, показываем дефолтную эмодзи
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "inline";
            }}
          />
          <span className="text-sm" style={{ display: "none" }}>
            👤
          </span>
        </div>
      );
    }
    return <span className="text-sm mr-2">{iconValue}</span>;
  };

  // Рендерим иконку для селектора
  const renderIconForSelect = (iconData) => {
    if (iconData.icon) {
      return (
        <img
          src={iconData.icon}
          alt={iconData.label}
          className="w-4 h-4 object-contain"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(77%) sepia(86%) saturate(364%) hue-rotate(4deg) brightness(96%) contrast(94%)",
          }}
          onError={(e) => {
            e.target.style.display = "none";
            if (e.target.nextElementSibling) {
              e.target.nextElementSibling.style.display = "inline";
            }
          }}
        />
      );
    }
    return <span className="text-sm">{iconData.emoji}</span>;
  };

  // Компонент кастомного селектора иконок
  const IconSelector = ({ value, onChange }) => {
    const selectedIcon = availableIcons.find((icon) => icon.value === value);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIconDropdownOpen(!iconDropdownOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
        >
          <div className="flex items-center">
            {selectedIcon && renderIconForSelect(selectedIcon)}
            <span className="ml-2">
              {selectedIcon?.label || "Выберите иконку"}
            </span>
          </div>
          <span className="text-gray-400">▼</span>
        </button>

        {iconDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {availableIcons.map((icon) => (
              <button
                key={icon.value}
                type="button"
                onClick={() => {
                  onChange(icon.value);
                  setIconDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center transition-colors"
              >
                {renderIconForSelect(icon)}
                <span className="ml-2">{icon.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const loadBlockData = async () => {
    try {
      const blockData = await contactInfoApi.getBlock(editingBlock.id);
      setBlock(blockData);
      setItems(blockData.items || []);

      setFormData({
        title: blockData.data?.title || { kz: "", ru: "", en: "" },
        settings: {
          showTitle: blockData.data?.settings?.showTitle ?? true,
          itemSpacing: blockData.data?.settings?.itemSpacing || "normal",
          iconSize: blockData.data?.settings?.iconSize || "medium",
        },
        backgroundColor: blockData.data?.backgroundColor || "#FFFFFF",
        isHidden: blockData.isHidden || false, // <-- исправлено здесь
      });

      // Загружаем переводы заголовка, если они есть
      setTitleTranslations(blockData.data?.title || {});
    } catch (err) {
      setError("Ошибка при загрузке данных блока: " + err.message);
    }
  };

  const handleTitleChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      title: {
        ...prev.title,
        [lang]: value,
      },
    }));
  };

  const handleSettingChange = (setting, value) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: value,
      },
    }));
  };

  const handleNewItemChange = (field, value) => {
    setNewItemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Отладка: проверяем formData
      console.log('Contact-info formData before submit:', formData);

      let resultBlock;

      if (isEditing) {
        // Обновляем блок
        console.log('Updating contact-info block with data:', formData);
        resultBlock = await contactInfoApi.updateBlock(
          editingBlock.id,
          formData
        );
      } else {
        // Создаем новый блок
        const blockData = {
          pageId: parseInt(pageId),
          isHidden: formData.isHidden || false, // Добавляем флаг скрытого блока
          ...formData,
        };
        console.log('Creating contact-info block with data:', blockData);
        resultBlock = await contactInfoApi.createBlock(blockData);
      }

      onSubmit(resultBlock);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      setError(null);

      if (!newItemData.text.trim()) {
        setError("Текст элемента обязателен");
        return;
      }

      if (newItemData.type === "link" && !newItemData.value.trim()) {
        setError("Для ссылки требуется указать URL");
        return;
      }

      if (newItemData.type === "file" && !selectedFile) {
        setError('Для типа "файл" требуется выбрать файл');
        return;
      }

      const blockId = isEditing ? editingBlock.id : block?.id;
      if (!blockId) {
        setError("Сначала создайте блок");
        return;
      }

      const newItem = await contactInfoApi.createItemAuto(
        blockId,
        newItemData,
        selectedFile
      );

      setItems((prev) => [...prev, newItem]);
      setNewItemData({
        type: "text",
        icon: "info",
        text: "",
        value: "",
      });
      setSelectedFile(null);
      setShowAddItem(false);

      // Обновляем данные блока
      await loadBlockData();
    } catch (err) {
      setError("Ошибка при добавлении элемента: " + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Удалить этот элемент?")) {
      return;
    }

    try {
      await contactInfoApi.deleteItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));

      // Обновляем данные блока
      await loadBlockData();
    } catch (err) {
      setError("Ошибка при удалении элемента: " + err.message);
    }
  };

  const handleReorderItems = async (fromIndex, toIndex) => {
    console.log("=== REORDER DEBUG START ===");
    console.log("Original items:", items);
    console.log("Moving from index", fromIndex, "to index", toIndex);

    // Проверяем исходные данные
    if (!items || items.length === 0) {
      console.error("No items to reorder");
      return;
    }

    if (
      fromIndex < 0 ||
      fromIndex >= items.length ||
      toIndex < 0 ||
      toIndex >= items.length
    ) {
      console.error("Invalid indices:", {
        fromIndex,
        toIndex,
        itemsLength: items.length,
      });
      return;
    }

    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    console.log("New items order:", newItems);

    setItems(newItems);

    try {
      const itemsOrder = newItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      console.log("Sending itemsOrder:", itemsOrder);
      console.log("Block ID:", block.id);
      console.log("Full request payload:", {
        blockId: block.id,
        itemsOrder: itemsOrder,
      });

      // Проверяем, что все ID валидны
      const invalidItems = itemsOrder.filter(
        (item) => !item.id || item.id === null || item.id === undefined
      );
      if (invalidItems.length > 0) {
        console.error("Items with invalid IDs:", invalidItems);
        throw new Error("Some items have invalid IDs");
      }

      await contactInfoApi.reorderItems(block.id, itemsOrder);
      console.log("Reorder completed successfully");
    } catch (err) {
      console.error("Reorder failed:", err);
      setError("Ошибка при изменении порядка: " + err.message);
      // Откатываем изменения
      await loadBlockData();
    }

    console.log("=== REORDER DEBUG END ===");
  };

  const getTypeLabel = (type) => {
    const typeMap = { text: "Текст", link: "Ссылка", file: "Файл" };
    return typeMap[type] || type;
  };

  // Получаем названия языков
  const getLanguageLabel = (code) => {
    const languageNames = {
      en: "English",
      ru: "Русский",
      kz: "Қазақша",
    };
    return languageNames[code] || code.toUpperCase();
  };

  const handleTitleTranslationChange = (lang, value) => {
    setTitleTranslations(prev => ({ ...prev, [lang]: value }));
    setFormData(prev => ({
      ...prev,
      title: {
        ...prev.title,
        [lang]: value,
      },
    }));
  };

  const getCurrentTitleTranslation = () => {
    return titleTranslations[currentLang] || '';
  };

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconDropdownOpen && !event.target.closest(".relative")) {
        setIconDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [iconDropdownOpen]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Форма блока */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Переводы заголовка через переключатель языков */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-gray-800 mb-4">📝 Переводы заголовка</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(formData.title).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setCurrentLang(lang)}
                className={`px-3 py-2 rounded font-medium text-sm transition-colors ${
                  currentLang === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {getLanguageLabel(lang)}
                {titleTranslations[lang] && (
                  <span className="ml-1 text-green-500">✓</span>
                )}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {getLanguageLabel(currentLang)}
            </label>
            <input
              type="text"
              value={getCurrentTitleTranslation()}
              onChange={e => handleTitleTranslationChange(currentLang, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Введите заголовок на ${getLanguageLabel(currentLang)}`}
            />
          </div>
        </div>

        {/* Настройки отображения */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">
            ⚙️ Настройки отображения
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.settings.showTitle}
                  onChange={(e) =>
                    handleSettingChange("showTitle", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Показывать заголовок
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Расстояние между элементами
              </label>
              <select
                value={formData.settings.itemSpacing}
                onChange={(e) =>
                  handleSettingChange("itemSpacing", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="compact">Компактное</option>
                <option value="normal">Обычное</option>
                <option value="spacious">Просторное</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Размер иконок
              </label>
              <select
                value={formData.settings.iconSize}
                onChange={(e) =>
                  handleSettingChange("iconSize", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Маленький</option>
                <option value="medium">Средний</option>
                <option value="large">Большой</option>
              </select>
            </div>
          </div>

          {/* Цвет фона */}
          {blockOptions?.['contact-info']?.backgroundColors && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цвет фона контейнера
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.backgroundColor || "#FFFFFF"}
                  onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <select
                  value={formData.backgroundColor || "#FFFFFF"}
                  onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blockOptions['contact-info'].backgroundColors.map((color) => (
                    <option key={color} value={color}>
                      {color} {color === '#FFFFFF' ? '(белый)' : color === '#F9FAFB' ? '(светло-серый)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
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

        {/* Кнопки сохранения блока */}
        <div className="flex space-x-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            )}
            {loading
              ? "Сохранение..."
              : isEditing
              ? "Обновить блок"
              : "Создать блок"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Отмена
          </button>
        </div>
      </form>

      {/* Управление элементами (только для существующих блоков) */}
      {(isEditing || block) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">
              📞 Элементы контактной информации
            </h4>
            <button
              onClick={() => setShowAddItem(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Добавить элемент
            </button>
          </div>

          {/* Список элементов */}
          {items.length > 0 && (
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="mr-3">{renderIcon(item.icon)}</div>
                        <div>
                          <span className="font-medium text-gray-900">
                            {getTypeLabel(item.type)}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({item.icon})
                          </span>
                        </div>
                      </div>

                      <div className="text-gray-800 mb-2">
                        <strong>Текст:</strong> {item.text}
                      </div>

                      {item.value && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Ссылка/Путь:</strong> {item.value}
                        </div>
                      )}

                      {item.fileName && (
                        <div className="text-sm text-green-700">
                          <strong>Файл:</strong> {item.fileName}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {index > 0 && (
                        <button
                          onClick={() => handleReorderItems(index, index - 1)}
                          className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                          title="Переместить вверх"
                        >
                          ↑
                        </button>
                      )}
                      {index < items.length - 1 && (
                        <button
                          onClick={() => handleReorderItems(index, index + 1)}
                          className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                          title="Переместить вниз"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 px-2 py-1 text-sm rounded border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Форма добавления элемента */}
          {showAddItem && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-4">
                Добавить новый элемент
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип элемента
                  </label>
                  <select
                    value={newItemData.type}
                    onChange={(e) =>
                      handleNewItemChange("type", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">📄 Текст (просто отображается)</option>
                    <option value="link">🔗 Ссылка (переход по клику)</option>
                    <option value="file">📁 Файл (скачивание по клику)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Иконка
                  </label>
                  <select
                    value={newItemData.icon}
                    onChange={(e) =>
                      handleNewItemChange("icon", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Предварительный просмотр выбранной иконки */}
              <div className="mb-4 p-3 bg-white rounded border border-gray-200">
                <div className="text-sm text-gray-600 mb-2">
                  Предварительный просмотр иконки:
                </div>
                <div className="flex items-center">
                  {renderIcon(newItemData.icon)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({newItemData.icon})
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст *
                </label>
                <input
                  type="text"
                  value={newItemData.text}
                  onChange={(e) => handleNewItemChange("text", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Текст который будет отображаться"
                  required
                />
              </div>

              {newItemData.type === "link" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ссылка *
                  </label>
                  <input
                    type="text"
                    value={newItemData.value}
                    onChange={(e) =>
                      handleNewItemChange("value", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com или tel:+77172472545 или mailto:info@example.com"
                    required
                  />
                </div>
              )}

              {newItemData.type === "file" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Файл *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.zip,.rar"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Поддерживаются: PDF, DOC, XLS, изображения, видео, архивы
                    (макс. 50MB)
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddItem(false);
                    setNewItemData({
                      type: "text",
                      icon: "info",
                      text: "",
                      value: "",
                    });
                    setSelectedFile(null);
                    setError(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Добавить элемент
                </button>
              </div>
            </div>
          )}

          {items.length === 0 && !showAddItem && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📞</div>
              <div className="font-medium mb-1">Элементы не добавлены</div>
              <div className="text-sm">
                Нажмите кнопку выше для добавления первого элемента
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactInfoBlockForm;
