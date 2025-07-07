import { Route, Routes } from "react-router-dom";
import RegistrationForm from "../pages/LoginPages/RegistrationForm/Registrationform";
import ForgetPassword from "../pages/LoginPages/ForgetPassword/ForgetPassword";
import LoginForm from "../pages/LoginPages/LoginForm/LoginForm";

const LoginRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/forget/password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default LoginRoutes;
