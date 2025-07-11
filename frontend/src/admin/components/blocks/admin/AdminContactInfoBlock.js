// components/admin/blocks/AdminContactInfoBlock.js
import React, { useState, useEffect } from "react";
import contactInfoApi from "../../../../api/contactInfoApi";

const AdminContactInfoBlock = ({ block = {}, currentLanguage = "ru" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (block?.id) {
      loadItems();
    }
  }, [block?.id]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const blockData = await contactInfoApi.getBlock(block.id);
      setItems(blockData.items || []);
    } catch (err) {
      console.error("Error loading items:", err);
    } finally {
      setLoading(false);
    }
  };

  const { data = {} } = block;

  // Получаем иконку (поддерживаем эмодзи, пользовательские иконки из Figma и URL)
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
      
      // Ваши иконки из Figma через /assets/icons/
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

  // Рендерим иконку для админки
  const renderIcon = (item) => {
    const iconValue = getIconEmoji(item.icon);
    if (isCustomIcon(iconValue)) {
      return (
        <img
          src={iconValue}
          alt={item.text}
          className="w-5 h-5 object-contain"
          style={{
            filter: "brightness(0) saturate(100%) invert(77%) sepia(86%) saturate(364%) hue-rotate(4deg) brightness(96%) contrast(94%)",
          }}
          onError={(e) => {
            // Если иконка не загрузилась, показываем дефолтную эмодзи
            e.target.style.display = "none";
            e.target.nextElementSibling.style.display = "inline";
          }}
        />
      );
    }
    return <span className="text-lg">{iconValue}</span>;
  };

  const getTitle = () => {
    if (!data?.title) return "";

    return (
      data.title[currentLanguage] ||
      data.title["ru"] ||
      data.title["kz"] ||
      data.title["en"] ||
      Object.values(data.title)[0] ||
      ""
    );
  };

  const formatValue = (item) => {
    if (!item.value) return null;
    return item.value.length > 40
      ? item.value.substring(0, 40) + "..."
      : item.value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
        <span className="text-sm text-gray-600">Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Заголовок блока */}
      {data?.settings?.showTitle && getTitle() && (
        <div className="text-base font-medium text-gray-800 mb-2">
          {getTitle()}
        </div>
      )}

      {/* Список элементов */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-start space-x-2 text-sm">
              <div className="relative">
                {renderIcon(item)}
                {/* Запасная эмодзи иконка для случая, если пользовательская не загрузилась */}
                {isCustomIcon(getIconEmoji(item.icon)) && (
                  <span className="text-lg" style={{ display: "none" }}>👤</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.text}</div>
                {item.value && (
                  <div className="text-xs text-gray-500">
                    {formatValue(item)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <div className="text-2xl mb-1">📞</div>
          <div className="text-sm">Элементы не добавлены</div>
        </div>
      )}

      {/* Информация о блоке */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <div className="grid grid-cols-2 gap-2">
          <div>Элементов: {items.length}</div>
          <div>Язык: {currentLanguage.toUpperCase()}</div>
          <div>
            Заголовок: {data?.settings?.showTitle ? "Показывать" : "Скрыть"}
          </div>
          <div>Расстояние: {data?.settings?.itemSpacing || "normal"}</div>
        </div>
      </div>

      {/* Переводы заголовка */}
      {data?.title &&
        Object.keys(data.title).some((lang) => data.title[lang]) && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <div className="mb-1">
              <strong>Доступные переводы заголовка:</strong>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(data.title)
                .filter(([_, title]) => title)
                .map(([lang, title]) => (
                  <span
                    key={lang}
                    className={`px-2 py-1 rounded text-xs ${
                      lang === currentLanguage
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lang.toUpperCase()}: {title.substring(0, 20)}
                    {title.length > 20 ? "..." : ""}
                  </span>
                ))}
            </div>
          </div>
        )}

      {/* Адаптивность */}
      <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
        <div className="flex items-center">
          <span className="mr-2">📱</span>
          <span>
            На мобильных устройствах: компактное отображение элементов
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminContactInfoBlock;