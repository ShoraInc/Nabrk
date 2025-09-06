import React, { useState, useEffect } from "react";
import {
  Search,
  Keyboard,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
} from "lucide-react";
import { getTypes, postQuestion, QuestionTrue } from "../../../../api/questionsApi";
import { useLanguage } from "../../../../context/LanguageContext";
import "./Questions.scss";

const translations = {
  kz: {
    askQuestion: "Сұрақ қою",
    allCategories: "Барлығы",
    searchPlaceholder: "Кілт сөздер арқылы іздеу",
    noResults: "Сұрақтар табылмады",
    loading: "Жүктелуде...",
    questionDate: "Дата жоқ",
    questionAuthor: "Автор",
    showAnswer: "Жауапты көрсету",
    hideAnswer: "Жауапты жасыру",
    inputName: "Аты",
    inputLastName: "Тегі",
    inputQuestion: "Сұрағыңыз",
    submit: "Жіберу",
    questionSuccess: "Сұрақ сәтті жіберілді!",
    questionError: "Сұрақты жіберу кезінде қате болды.",
    categories: "Категориялар",
    questions: "Сұрақтар",
  },
  ru: {
    askQuestion: "Задать вопрос",
    allCategories: "Все категории",
    searchPlaceholder: "Поиск по ключевым словам",
    noResults: "Вопросы не найдены",
    loading: "Загрузка...",
    questionDate: "Дата отсутствует",
    questionAuthor: "Автор",
    showAnswer: "Показать ответ",
    hideAnswer: "Скрыть ответ",
    inputName: "Имя",
    inputLastName: "Фамилия",
    inputQuestion: "Ваш вопрос",
    submit: "Отправить",
    questionSuccess: "Вопрос успешно отправлен!",
    questionError: "Ошибка при отправке вопроса.",
    categories: "Категории",
    questions: "Вопросы",
  },
  en: {
    askQuestion: "Ask a Question",
    allCategories: "All Categories",
    searchPlaceholder: "Search by keywords",
    noResults: "No questions found",
    loading: "Loading...",
    questionDate: "Date not available",
    questionAuthor: "Author",
    showAnswer: "Show Answer",
    hideAnswer: "Hide Answer",
    inputName: "Name",
    inputLastName: "Last Name",
    inputQuestion: "Your question",
    submit: "Submit",
    questionSuccess: "Question submitted successfully!",
    questionError: "Error while submitting question.",
    categories: "Categories",
    questions: "Questions",
  },
};

const Sidebar = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onAskQuestion,
  isOpen,
  onClose,
}) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.kz;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar sidebar--desktop">
        <div className="sidebar__header">
          <button className="sidebar__ask-btn" onClick={onAskQuestion}>
            {t.askQuestion}
          </button>
        </div>
        
        <div className="sidebar__content">
          <div className="sidebar__categories">
            <div
              className={`sidebar__category ${selectedCategory === null ? 'sidebar__category--active' : ''}`}
              onClick={() => onCategorySelect(null)}
            >
              {t.allCategories}
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`sidebar__category ${selectedCategory === category.id ? 'sidebar__category--active' : ''}`}
                onClick={() => onCategorySelect(category.id)}
              >
                {category.titles[currentLanguage]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div className="sidebar__overlay" onClick={onClose} />
          
          <div className="sidebar sidebar--mobile">
            <div className="sidebar__mobile-content">
              {/* Header with close button */}
              <div className="sidebar__mobile-header">
                <h2 className="sidebar__mobile-title">{t.categories}</h2>
                <button className="sidebar__close-btn" onClick={onClose}>
                  <X className="sidebar__close-icon" />
                </button>
              </div>
              
              {/* Ask Question Button */}
              <div className="sidebar__mobile-ask">
                <button 
                  className="sidebar__ask-btn sidebar__ask-btn--mobile"
                  onClick={() => {
                    onAskQuestion();
                    onClose();
                  }}
                >
                  <User className="sidebar__ask-icon" />
                  {t.askQuestion}
                </button>
              </div>
              
              {/* Categories */}
              <div className="sidebar__mobile-categories">
                <div className="sidebar__categories">
                  <div
                    className={`sidebar__category sidebar__category--mobile ${selectedCategory === null ? 'sidebar__category--active' : ''}`}
                    onClick={() => {
                      onCategorySelect(null);
                      onClose();
                    }}
                  >
                    {t.allCategories}
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`sidebar__category sidebar__category--mobile ${selectedCategory === category.id ? 'sidebar__category--active' : ''}`}
                      onClick={() => {
                        onCategorySelect(category.id);
                        onClose();
                      }}
                    >
                      {category.titles[currentLanguage]}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar__spacer" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.kz;

  const keyboardLayout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Delete"],
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"],
    ["ә", "і", "ң", "ғ", "ү", "ұ", "қ", "ө", "һ"],
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleKeyClick = (key) => {
    if (key === "Delete") {
      setSearchQuery((prev) => prev.slice(0, -1));
    } else {
      setSearchQuery((prev) => prev + key);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          className="search-bar__input"
        />
        <div className="search-bar__controls">
          {!isMobile && (
            <>
              <button
                className="search-bar__btn search-bar__btn--keyboard"
                onClick={() => setShowKeyboard(!showKeyboard)}
              >
                <Keyboard className="search-bar__icon" />
              </button>
              <div className="search-bar__divider" />
            </>
          )}
          <button
            className="search-bar__btn search-bar__btn--search"
            onClick={onSearch}
          >
            <Search className="search-bar__icon" />
          </button>
        </div>
      </div>
      
      {!isMobile && showKeyboard && (
        <div className="virtual-keyboard">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="virtual-keyboard__row">
              {row.map((key) => (
                <button
                  key={key}
                  className={`virtual-keyboard__key ${key === "Delete" ? 'virtual-keyboard__key--delete' : ''}`}
                  onClick={() => handleKeyClick(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuestionItem = ({ question }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.kz;

  const fullName = `${question.Name} ${question.LastName}`;
  const questionText = question.Question;
  const answer = question.Answer?.answer;
  const category =
    question.Answer?.Type?.titles?.[currentLanguage] ||
    question.Answer?.Type?.titles?.ru ||
    question.Answer?.Type?.titles?.kz ||
    question.Answer?.Type?.titles?.en;

  const date = question.Answer?.createdAt
    ? new Date(question.Answer.createdAt).toISOString().split("T")[0]
    : t.questionDate;

  return (
    <div className="question-item">
      <div className="question-item__content">
        <div className="question-item__header">
          <div className="question-item__meta">
            <span className="question-item__date">{date}</span>
            <span className="question-item__author">{fullName}</span>
          </div>
          {category && (
            <div className="question-item__category">
              {category}
            </div>
          )}
        </div>
        
        <div className="question-item__text">
          {questionText}
        </div>

        {answer && (
          <div className="question-item__answer-section">
            <button
              className="question-item__toggle"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="question-item__toggle-text">
                {isExpanded ? t.hideAnswer : t.showAnswer}
              </span>
              {isExpanded ? 
                <ChevronUp className="question-item__toggle-icon" /> : 
                <ChevronDown className="question-item__toggle-icon" />
              }
            </button>
            
            {isExpanded && (
              <div className="question-item__answer">
                {answer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AskQuestionModal = ({ isOpen, onClose, onQuestionSubmitted }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.kz;

  const [form, setForm] = useState({
    Name: "",
    LastName: "",
    Question: "",
  });

  const handleSubmit = async () => {
    if (!form.Name || !form.LastName || !form.Question) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const res = await postQuestion(form);

      if (res.newQuestion) {
        alert(t.questionSuccess);
        setForm({ Name: "", LastName: "", Question: "" });
        onClose();
        if (onQuestionSubmitted) {
          onQuestionSubmitted();
        }
      }
    } catch (error) {
      alert(t.questionError);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__content">
        <div className="modal__inner">
          <div className="modal__header">
            <h2 className="modal__title">{t.askQuestion}</h2>
            <button className="modal__close" onClick={onClose}>
              <X className="modal__close-icon" />
            </button>
          </div>

          <div className="modal__form">
            <div className="modal__field">
              <input
                type="text"
                placeholder={t.inputName}
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                className="modal__input"
              />
            </div>
            
            <div className="modal__field">
              <input
                type="text"
                placeholder={t.inputLastName}
                value={form.LastName}
                onChange={(e) => setForm({ ...form, LastName: e.target.value })}
                className="modal__input"
              />
            </div>
            
            <div className="modal__field">
              <textarea
                placeholder={t.inputQuestion}
                value={form.Question}
                onChange={(e) => setForm({ ...form, Question: e.target.value })}
                rows={4}
                className="modal__textarea"
              />
            </div>
            
            <button 
              onClick={handleSubmit}
              className="modal__submit"
            >
              {t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Questions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const questionsPerPage = 10;

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.kz;

  // Закрытие sidebar при прокрутке
  useEffect(() => {
    const handleScroll = () => {
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSidebarOpen]);

  // Загрузка категорий
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const typeResponse = await getTypes();
        if (typeResponse.types) {
          setCategories(typeResponse.types);
        }
      } catch (error) {
        console.error("Ошибка при загрузке категорий", error);
      }
    };

    loadCategories();
  }, []);

  // Функция для загрузки вопросов
  const fetchQuestions = async (filters = {}) => {
    try {
      setIsLoading(true);
      const response = await QuestionTrue(filters);

      if (response && response.questions) {
        setQuestions(response.questions);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Ошибка при загрузке вопросов", error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Начальная загрузка вопросов
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Обработка поиска
  const handleSearch = () => {
    const filters = {};

    if (searchQuery.trim()) {
      filters.query = searchQuery.trim();
    }

    if (selectedCategory) {
      filters.typeId = selectedCategory;
    }

    setCurrentPage(1);
    fetchQuestions(filters);
  };

  // Фильтрация по категории (без автоматического поиска по тексту)
  useEffect(() => {
    const filters = {};

    if (selectedCategory) {
      filters.typeId = selectedCategory;
    }

    setCurrentPage(1);
    fetchQuestions(filters);
  }, [selectedCategory]); // Убрал searchQuery из зависимостей

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="questions-page">
      <div className="questions-layout">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onAskQuestion={() => setIsModalOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="questions-main">
          {/* Mobile Header */}
          <div className="questions-header">
            <div className="questions-header__content">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="questions-header__menu"
              >
                <Menu className="questions-header__menu-icon" />
              </button>
              <h1 className="questions-header__title">{t.questions}</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="questions-header__ask"
              >
                {t.askQuestion}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="questions-content">
            <div className="questions-container">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
              />

              {isLoading ? (
                <div className="questions-loading">
                  <div className="questions-loading__content">
                    <div className="questions-loading__spinner"></div>
                    <p className="questions-loading__text">{t.loading}</p>
                  </div>
                </div>
              ) : questions.length === 0 ? (
                <div className="questions-empty">
                  <div className="questions-empty__icon">
                    <Search />
                  </div>
                  <p className="questions-empty__text">{t.noResults}</p>
                </div>
              ) : (
                <div className="questions-list">
                  {currentQuestions.map((question) => (
                    <QuestionItem key={question.id} question={question} />
                  ))}
                </div>
              )}

              {questions.length > 0 && totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination__btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="pagination__icon" />
                  </button>

                  <div className="pagination__pages">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }

                      return (
                        <button
                          key={pageNumber}
                          className={`pagination__page ${currentPage === pageNumber ? 'pagination__page--active' : ''}`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="pagination__btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="pagination__icon" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AskQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuestionSubmitted={() => {
          fetchQuestions({
            ...(selectedCategory && { typeId: selectedCategory }),
            ...(searchQuery.trim() && { query: searchQuery.trim() }),
          });
        }}
      />
    </div>
  );
}