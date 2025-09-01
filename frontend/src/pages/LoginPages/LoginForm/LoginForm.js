import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { switchToRegistration, switchToForgetPassword } from '../../../store/modalSlice';
import './LoginForm.scss';
import LoginHeader from '../../../components/layout/LoginHeader/LoginHeader';
import wireframe from './img/wireframe_black.png';
import AuthApi from '../../../api/authApi';
import { useTranslations } from '../../../hooks/useTranslations';

const LoginForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslations();

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
      alert(t('auth.login.fillRequired'));
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

      alert(t('auth.login.success'));
      onClose();

    } catch (error) {
      console.error('Login error:', error);
      alert(`${t('auth.login.error')}: ${error.message}`);
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
                  {t('auth.login.description')}
                </p>
              </div>
            </div>

            <div className="login-form__main">
              <div className="login-form__header">
                <h1 className="login-form__title">{t('auth.login.welcome')}.</h1>
                <p className="login-form__description">
                  {t('auth.login.serviceDescription')}
                </p>
              </div>

              <form className="login-form__form" onSubmit={handleSubmit}>

                <div className="login-form__field">
                  <label className="login-form__label">
                    {t('auth.login.readerNumber')}
                    <input
                      type="text"
                      className="login-form__input"
                      name="readerNumber"
                      value={formData.readerNumber}
                      onChange={handleInputChange}
                      placeholder={t('auth.login.readerNumberPlaceholder')}
                      required
                      disabled={isLoading}
                    />
                  </label>
                </div>

                <div className="login-form__field">
                  <label className="login-form__label">
                    {t('auth.login.password')}
                    <div className="login-form__password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="login-form__input"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={t('auth.login.passwordPlaceholder')}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="login-form__password-toggle"
                        onClick={togglePasswordVisibility}
                        title={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
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
                    {t('auth.login.forgotPassword')}
                  </button>
                </div>

                <button
                  type="submit"
                  className="login-form__submit"
                  disabled={!formData.readerNumber.trim() || !formData.password.trim() || isLoading}
                >
                  {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
                </button>
              </form>

              <div className="login-form__switch">
                <p>{t('auth.login.noAccount')}</p>
                <button
                  className="login-form__switch-btn"
                  onClick={handleSwitchToRegistration}
                  type="button"
                >
                  {t('auth.login.register')}
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