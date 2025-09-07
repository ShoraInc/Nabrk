// Cabinet/components/ChangePassword.js
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const ChangePassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: API call для смены пароля
      console.log('Password changed successfully');
      
      // Очистить форму
      setPasswordForm({
        current: '',
        new: '',
        confirm: ''
      });
      
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Сменить пароль</h2>
      </div>
      
      <div className="password-change-container">
        <form onSubmit={handleSubmit} className="password-form">
          
          <div className="input-group">
            <div className="input-container">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                placeholder="Текущий пароль"
                value={passwordForm.current}
                onChange={(e) => handleInputChange('current', e.target.value)}
                disabled={loading}
                className="password-input"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                placeholder="Новый пароль"
                value={passwordForm.new}
                onChange={(e) => handleInputChange('new', e.target.value)}
                disabled={loading}
                className="password-input"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <div className="input-container">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder="Подтверждение пароля"
                value={passwordForm.confirm}
                onChange={(e) => handleInputChange('confirm', e.target.value)}
                disabled={loading}
                className="password-input"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-password-btn"
            disabled={loading}
          >
            <Lock size={18} />
            <span>{loading ? 'Изменяем пароль...' : 'Сменить пароль'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;