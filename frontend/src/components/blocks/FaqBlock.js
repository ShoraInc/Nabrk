import React, { useState, useEffect } from "react";
import Plus from "./assets/icons/Plus.png";
import X from "./assets/icons/X.png";
import BlockRenderer from "./BlockRenderer";
import blocksApi from "../../api/blocksApi";

const FaqBlock = ({ block, currentLanguage = "kz", isMobile = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [childBlocks, setChildBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data } = block;
  const { translations = {}, settings = {} } = data;

  // Получаем вопрос для текущего языка
  const getQuestion = () => {
    const translations = data.translations || {};
    // Показываем только реально существующие переводы
    const availableLangs = Object.keys(translations).filter(lang => translations[lang]);
    return (
      translations[currentLanguage] ||
      translations["kz"] ||
      translations["en"] ||
      Object.values(translations).find(Boolean) ||
      "Вопрос не задан"
    );
  };

  const question = getQuestion();
  const animation = settings.animation || "slide";
  const initialExpanded = settings.isExpanded ?? false;

  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);

  useEffect(() => {
    if (isExpanded) {
      loadChildBlocks();
    }
  }, [isExpanded, block.id]);

  const loadChildBlocks = async () => {
    if (childBlocks.length > 0) return; // Уже загружены

    try {
      setLoading(true);
      setError(null);

      const response = await blocksApi.getChildBlocks(block.id, "faq_answer");
      setChildBlocks(response.childBlocks || []);
    } catch (err) {
      console.error("Error loading child blocks:", err);
      setError("Ошибка при загрузке ответа");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Стили для анимации
  const getAnimationStyles = () => {
    switch (animation) {
      case "slide":
        return {
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
        };
      case "fade":
        return {
          transition: "opacity 0.3s ease-in-out",
          opacity: isExpanded ? 1 : 0,
        };
      default:
        return {};
    }
  };

  // Стили для мобильной и десктопной версии БЕЗ border и background
  const mobileStyles = {
    container: {
      margin: "16px 0",
      backgroundColor: "transparent", // Убираем фон
      border: "none", // Убираем границу
    },
    header: {
      padding: "16px 0", // Убираем горизонтальные отступы
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: isExpanded ? "1px solid #e5e7eb" : "none",
      backgroundColor: "transparent", // Убираем фон заголовка
    },
    question: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#374151",
      margin: 0,
      flex: 1,
      textAlign: "left",
    },
    content: {
      padding: "16px 0", // Убираем горизонтальные отступы
      backgroundColor: "transparent", // Убираем фон содержимого
    },
  };

  const desktopStyles = {
    container: {
      margin: "24px 0",
      backgroundColor: "transparent", // Убираем фон
      border: "none", // Убираем границу
      boxShadow: "none", // Убираем тень
    },
    header: {
      padding: "20px 0", // Убираем горизонтальные отступы
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: isExpanded ? "1px solid #e5e7eb" : "none",
      backgroundColor: "transparent", // Убираем фон заголовка
    },
    question: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#374151",
      margin: 0,
      flex: 1,
      textAlign: "left",
    },
    content: {
      padding: "24px 0", // Убираем горизонтальные отступы
      backgroundColor: "transparent", // Убираем фон содержимого
    },
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <div style={styles.container}>
      {/* Заголовок FAQ */}
      <div
        style={styles.header}
        onClick={handleToggle}
        className="hover:bg-gray-50 transition-colors"
      >
        <h3 style={styles.question}>{question}</h3>

        {/* Иконка стрелки */}
        <div className="faq__icon-wrapper">
          <img
            src={Plus}
            alt="Expand"
            className={`faq__icon faq__icon--plus ${
              isExpanded ? "faq__icon--hidden" : ""
            }`}
          />
          <img
            src={X}
            alt="Collapse"
            className={`faq__icon faq__icon--x ${
              isExpanded ? "faq__icon--visible" : ""
            }`}
          />
        </div>
      </div>

      {/* Содержимое FAQ */}
      {isExpanded && (
        <div
          style={{
            ...styles.content,
            ...getAnimationStyles(),
          }}
        >
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-gray-600">Загрузка ответа...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && childBlocks.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📝</div>
              <div>Ответ не настроен</div>
              <div className="text-sm">Обратитесь к администратору</div>
            </div>
          )}

          {!loading && !error && childBlocks.length > 0 && (
            <div className="space-y-4">
              {childBlocks.map((childBlock) => (
                <div key={childBlock.relationId}>
                  <BlockRenderer
                    block={childBlock.block}
                    currentLanguage={currentLanguage}
                    isMobile={isMobile}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaqBlock;
