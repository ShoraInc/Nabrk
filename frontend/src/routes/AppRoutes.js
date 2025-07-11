// routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes';
import LoginRoutes from './LoginRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Публичные роуты */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Админские роуты */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Роуты авторизации */}
      <Route path="/auth/*" element={<LoginRoutes />} />
    </Routes>
  );
};

export default AppRoutes;