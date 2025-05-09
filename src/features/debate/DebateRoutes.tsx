import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DebateListPage from './pages/DebateListPage';
import DebateDetailPage from './pages/DebateDetailPage';
import MainIssuesPage from './pages/MainIssuesPage';
import AppLayout from '@/components/layout/AppLayout';

/**
 * 토론 기능의 라우팅을 관리하는 컴포넌트
 */
const DebateRoutes: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<MainIssuesPage />} />
        <Route path="/list" element={<DebateListPage />} />
        <Route path="/:id" element={<DebateDetailPage />} />
        <Route path="*" element={<Navigate to="/debate" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default DebateRoutes;
