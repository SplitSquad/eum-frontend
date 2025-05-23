import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 페이지 컴포넌트들
import UserManagePage from './pages/UserManagePage';
import AdminManagePage from './pages/AdminManagePage';

/**
 * 관리자페이지 서브 라우트
 * 관리자페이지 내의 페이지를 라우팅합니다.
 */
export const AdminpageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminManagePage />} />
      <Route path="/userManage" element={<UserManagePage />} />
    </Routes>
  );
};

export default AdminpageRoutes;
