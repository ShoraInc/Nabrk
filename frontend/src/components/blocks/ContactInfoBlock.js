// components/blocks/ContactInfoBlock.js
import React from "react";

const ContactInfoBlock = ({
  block,
  currentLanguage = "kz",
  isMobile = false,
}) => {
  const { data } = block;
  // Используем contactInfoItems из связи или items из data
  const items = block.contactInfoItems || data?.items || [];

  // Отладочная информация
  console.log("ContactInfoBlock received:", {
    blockType: block.type,
    blockId: block.id,
    contactInfoItems: block.contactInfoItems,
    dataItems: data?.items,
    finalItems: items,
    itemsCount: items.length,
  });

  // Получаем заголовок для текущего языка с фоллбэком
  const getTitle = () => {
    if (!data?.title) return "";
    // Показываем только реально существующие переводы
    const availableLangs = Object.keys(data.title).filter(lang => data.title[lang]);
    return (
      data.title[currentLanguage] ||
      data.title["kz"] ||
      data.title["ru"] ||
      data.title["en"] ||
      Object.values(data.title).find(Boolean) ||
      ""
    );
  };

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

  // Рендерим иконку
  const renderIcon = (item, styles) => {
    const iconValue = getIconEmoji(item.icon);
    if (isCustomIcon(iconValue)) {
      return (
        <img
          src={iconValue}
          alt={item.text}
          style={{
            ...styles.icon,
            width: "20px",
            height: "20px",
            objectFit: "contain",
            filter:
              "brightness(0) saturate(100%) invert(77%) sepia(86%) saturate(364%) hue-rotate(4deg) brightness(96%) contrast(94%)",
          }}
          onError={(e) => {
            // Если иконка не загрузилась, показываем дефолтную
            e.target.style.display = "none";
            e.target.nextElementSibling.style.display = "inline";
          }}
        />
      );
    }
    return (
      <span style={styles.icon}>
        {iconValue}
      </span>
    );
  };

  // Обработчик клика по элементу
  const handleItemClick = (item) => {
    switch (item.type) {
      case "link":
        if (item.value) {
          window.open(item.value, "_blank", "noopener,noreferrer");
        }
        break;
      case "file":
        if (item.value) {
          // Создаем ссылку для скачивания
          const link = document.createElement("a");
          link.href = `${process.env.REACT_APP_API_URL || ""}${item.value}`;
          link.download = item.fileName || "download";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        break;
      case "text":
      default:
        // Для обычного текста ничего не делаем
        break;
    }
  };

  // CSS стили для мобильных устройств
  const mobileStyles = {
    container: {
      border: data?.borderColor && data.borderColor !== 'transparent' 
        ? `1px solid ${data.borderColor}` 
        : "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: data?.backgroundColor || "#ffffff",
      fontSize: "14px",
      lineHeight: "1.5",
      maxWidth: "400px",
      margin: "0 auto",
    },
    title: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "16px",
      textAlign: "left",
    },
    itemsList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    item: {
      display: "flex",
      alignItems: "center",
      cursor: "default",
      transition: "all 0.2s ease",
    },
    clickableItem: {
      cursor: "pointer",
    },
    icon: {
      fontSize: "20px",
      marginRight: "16px",
      flexShrink: 0,
      color: "#f59e0b",
      marginTop: "2px",
      display: "inline-block",
    },
    text: {
      color: "#374151",
      fontSize: "14px",
      lineHeight: "1.4",
      flex: 1,
      wordWrap: "break-word",
    },
  };

  // CSS стили для десктопа
  const desktopStyles = {
    container: {
      border: data?.borderColor && data.borderColor !== 'transparent' 
        ? `1px solid ${data.borderColor}` 
        : "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "24px",
      backgroundColor: data?.backgroundColor || "#ffffff",
      fontSize: "16px",
      lineHeight: "1.5",
      margin: "0 auto",
    },
    title: {
      fontSize: "18px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "20px",
      textAlign: "left",
    },
    itemsList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    item: {
      display: "flex",
      alignItems: "center",
      cursor: "default",
      transition: "all 0.2s ease",
    },
    clickableItem: {
      cursor: "pointer",
    },
    clickableItemHover: {
      color: "#1f2937",
    },
    icon: {
      fontSize: "20px",
      marginRight: "16px",
      flexShrink: 0,
      color: "#f59e0b",
      marginTop: "2px",
      display: "inline-block",
    },
    text: {
      color: "#374151",
      fontSize: "16px",
      lineHeight: "1.4",
      flex: 1,
      wordWrap: "break-word",
    },
  };

  const styles = isMobile ? mobileStyles : desktopStyles;
  const title = getTitle();

  // Если нет элементов, не показываем блок
  if (items.length === 0) {
    return (
      <div style={styles.container}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          Нет элементов для отображения
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Заголовок блока */}
      {data?.settings?.showTitle && title && (
        <h3 style={styles.title}>{title}</h3>
      )}

      {/* Список элементов */}
      <div style={styles.itemsList}>
        {items.map((item, index) => {
          const isClickable = item.type === "link" || item.type === "file";
          return (
            <div
              key={item.id || index}
              onClick={() => handleItemClick(item)}
              style={{
                ...styles.item,
                ...(isClickable ? styles.clickableItem : {}),
              }}
              onMouseEnter={(e) => {
                if (isClickable && !isMobile) {
                  e.currentTarget.style.color = "#1f2937";
                }
              }}
              onMouseLeave={(e) => {
                if (isClickable && !isMobile) {
                  e.currentTarget.style.color = "#374151";
                }
              }}
              title={
                isClickable
                  ? item.type === "link"
                    ? `Перейти: ${item.value}`
                    : item.type === "file"
                    ? `Скачать: ${item.fileName || "файл"}`
                    : ""
                  : undefined
              }
            >
              {/* Иконка */}
              <div style={{ position: "relative" }}>
                {renderIcon(item, styles)}
                {/* Запасная эмодзи иконка для случая, если пользовательская не загрузилась */}
                {isCustomIcon(getIconEmoji(item.icon)) && (
                  <span style={{ ...styles.icon, display: "none" }}>👤</span>
                )}
              </div>

              {/* Текст */}
              <div style={styles.text}>{item.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactInfoBlock;