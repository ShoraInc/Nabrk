import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { switchToRegistration, switchToForgetPassword } from '../../../store/modalSlice';
import './LoginForm.scss';
import LoginHeader from '../../../components/layout/LoginHeader/LoginHeader';
import wireframe from './img/wireframe_black.png';
import AuthApi from '../../../api/authApi';

const LoginForm = ({ onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    readerNumber: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.readerNumber.trim() || !formData.password.trim()) {
      alert('Оқырман нөмірі мен құпия сөзді толтырыңыз');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Login attempt:', formData);

      // Отправка на сервер
      const response = await AuthApi.signIn({
        username: formData.readerNumber,
        password: formData.password
      });

      console.log('Login response:', response);

      alert('Сәтті кірдіңіз!');
      onClose();

    } catch (error) {
      console.error('Login error:', error);
      alert(`Кіру қатесі: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegistration = () => {
    dispatch(switchToRegistration());
  };

  const handleSwitchToForgetPassword = () => {
    dispatch(switchToForgetPassword());
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <LoginHeader onClose={onClose} />

      <div className="login-form__layout">
        <div className="login-form__form-section">
          <div className="login-form__container">

            <div className="login-form__warning">
              <div className="login-form__warning-icon">⚠️</div>
              <div className="login-form__warning-content">
                <h3>Құрметті пайдаланушы!</h3>
                <p>
                  Авторизацияңдан кейін жеке кабинетіңізде
                  электрондық поштаңыздың дұрыс толтырылғанын
                  тексеріңіз.
                </p>
              </div>
            </div>

            <div className="login-form__main">
              <div className="login-form__header">
                <h1 className="login-form__title">Қош келдіңіз.</h1>
                <p className="login-form__description">
                  ҚР ҰАК-нен қызметтерін пайдалану үшін
                </p>
              </div>

              <form className="login-form__form" onSubmit={handleSubmit}>

                <div className="login-form__field">
                  <label className="login-form__label">
                    Оқырман билетінің нөмірі
                    <input
                      type="text"
                      className="login-form__input"
                      name="readerNumber"
                      value={formData.readerNumber}
                      onChange={handleInputChange}
                      placeholder="Оқырман нөміріңізді жазыңыз"
                      required
                      disabled={isLoading}
                    />
                  </label>
                </div>

                <div className="login-form__field">
                  <label className="login-form__label">
                    Құпия сөз
                    <div className="login-form__password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="login-form__input"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Құпия сөзіңізді жазыңыз"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="login-form__password-toggle"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </label>

                  <button
                    type="button"
                    className="login-form__forgot-password"
                    onClick={handleSwitchToForgetPassword}
                  >
                    Құпия сөзді ұмытып қалдыныз ба?
                  </button>
                </div>

                <button
                  type="submit"
                  className="login-form__submit"
                  disabled={!formData.readerNumber.trim() || !formData.password.trim() || isLoading}
                >
                  {isLoading ? 'Жалғастыру...' : 'Жалғастыру'}
                </button>
              </form>

              <div className="login-form__switch">
                <p>Аккаунтыңыз жоқ па?</p>
                <button
                  className="login-form__switch-btn"
                  onClick={handleSwitchToRegistration}
                  type="button"
                >
                  Тіркелу
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default LoginForm;