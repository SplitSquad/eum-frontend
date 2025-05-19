import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 페이지 컴포넌트들
import CommunityManagePage from './pages/CommunityManagePage';
import DebateManagePage from './pages/DebateManagePage';
import UserManagePage from './pages/UserManagePage';

/**
 * 관리자페이지 서브 라우트
 * 관리자페이지 내의 페이지를 라우팅합니다.
 */
export const AdminpageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserManagePage />} />
      <Route path="/communityManage" element={<CommunityManagePage />} />
      <Route path="/debateManage" element={<DebateManagePage />} />
    </Routes>
  );
};

export default AdminpageRoutes;
