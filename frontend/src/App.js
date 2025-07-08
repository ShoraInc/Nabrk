import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/homePage/home";
import { useEffect } from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import VerticalLines from "./components/VerticalLines/VerticalLines";
import StaticRoutes from "./routes/StaticRoutes";
import LoginRoutes from "./routes/LoginRoutes";
import { Provider } from "react-redux";
import { store } from "./store";
import NewsDetail from "./pages/NewsDetailPage/NewsDetail";
import LoginHeader from "./components/LoginHeader/LoginHeader";
import News from "./pages/NewsPage/News";
import Page from "./pages/Page/Page";
// Импорты для админки
import AdminNews from "./admin/pages/News/AdminNews";
import AdminNewsDrafts from "./admin/pages/News/AdminNewsDrafts";
import AdminNewsForm from "./admin/pages/News/AdminNewsForm";
import AdminEventsDrafts from "./admin/pages/Events/AdminEventsDrafts";
import AdminEventsForm from "./admin/pages/Events/AdminEventsForm";
import AdminEvents from "./admin/pages/Events/AdminEvents";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith("/auth");
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      {/* Показываем хедер только если это не страница логина и не админка */}
      {!isLoginPage && !isHomePage && !isAdminPage && <LoginHeader />}
      <ScrollToTop />

      <div className="main-content">
        {/* Вертикальные линии не показываем на админских страницах */}
        {!isLoginPage && !isAdminPage && <VerticalLines />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/pages/:id" element={<Page />} />

          {/* Админские роуты */}
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/news/drafts" element={<AdminNewsDrafts />} />
          <Route path="/admin/news/create" element={<AdminNewsForm />} />
          <Route path="/admin/news/edit/:id" element={<AdminNewsForm />} />

          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/events/drafts" element={<AdminEventsDrafts />} />
          <Route path="/admin/events/create" element={<AdminEventsForm />} />
          <Route path="/admin/events/edit/:id" element={<AdminEventsForm />} />

          <Route path="/auth/*" element={<LoginRoutes />} />
          <Route path="/*" element={<StaticRoutes />} />
        </Routes>
      </div>

      {/* Футер не показываем на админских страницах */}
      {!isLoginPage && !isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
