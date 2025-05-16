import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 페이지 컴포넌트들
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ActivitiesPage from './pages/ActivitiesPage';

/**
 * 마이페이지 서브 라우트
 * 마이페이지 내의 다양한 페이지들을 라우팅합니다.
 */
export const MypageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
    </Routes>
  );
};

export default MypageRoutes; 