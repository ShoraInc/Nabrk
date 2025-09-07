// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { LanguageProvider } from "./context/LanguageContext";

// Компоненты layout - ОБНОВЛЕННЫЕ ПУТИ
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import VerticalLines from "./components/ui/VerticalLines/VerticalLines";

// Роуты
import AppRoutes from "./routes/AppRoutes";

// Компонент для скролла наверх при смене страницы
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Основной контент приложения
function AppContent() {
  const location = useLocation();
  
  // Определяем типы страниц
  const isLoginPage = location.pathname.startsWith("/auth");
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin") || location.pathname.startsWith("/cabinet");
  const isQuestionsPage = location.pathname.startsWith("/questions");
  
  // Определяем, показывать ли Header
  const showHeader = !isLoginPage && !isHomePage && !isAdminPage;
  
  // Определяем, показывать ли Footer и VerticalLines
  const showFooterAndLines = !isLoginPage && !isAdminPage && !isQuestionsPage;

  return (
    <div className="App">
      {/* Header только на публичных страницах (кроме главной) */}
      {showHeader && <Header />}
      
      {/* Скролл наверх при навигации */}
      <ScrollToTop />
      
      <div className="main-content">
        {/* Вертикальные линии только на публичных страницах */}
        {showFooterAndLines && <VerticalLines isHomePage={isHomePage} />}
        
        {/* Все роуты */}
        <AppRoutes />
      </div>
      
      {/* Footer только на публичных страницах */}
      {showFooterAndLines && <Footer />}
    </div>
  );
}

// Главный компонент App
function App() {
  return (
    <LanguageProvider>
      <Provider store={store}>
        <Router>
          <AppContent />
        </Router>
      </Provider>
    </LanguageProvider>
  );
}

export default App;