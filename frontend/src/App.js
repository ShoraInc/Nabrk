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
import VerticalLines from "./components/VerticalLines/VerticalLines"; // Импортируем компонент
import StaticRoutes from "./routes/StaticRoutes";
import LoginRoutes from "./routes/LoginRoutes";
import { Provider } from "react-redux";
import { store } from "./store";

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

  return (
    <div className="App">
      {!isLoginPage && !isHomePage && <Header />}
      <ScrollToTop />

      <div className="main-content">
        {!isLoginPage && <VerticalLines />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/*" element={<LoginRoutes />} />
          <Route path="/*" element={<StaticRoutes />} />
        </Routes>
      </div>

      {!isLoginPage && <Footer />}
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
