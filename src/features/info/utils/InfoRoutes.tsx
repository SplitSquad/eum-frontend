import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { InfoListPage, InfoCreatePage, InfoDetailPage } from '../pages';
import ProInfoListPage from '../pages/theme/ProInfoList';
import { RoleGuard } from '../../../routes/guards';
//import AppLayout from '@/components/layout/AppLayout';
export const InfoRoutes: React.FC = () => {
  return (
    <Routes>
      {/* /info/           -> 목록 */}
      <Route path="" element={<ProInfoListPage />} />

      {/* /info/create     -> 글 쓰기 (관리자만) */}
      <Route
        path="create"
        element={
          <RoleGuard requiredRole="ROLE_ADMIN">
            <InfoCreatePage />
          </RoleGuard>
        }
      />

      {/* /info/edit/:id   -> 글 수정 (관리자만) */}
      <Route
        path="edit/:id"
        element={
          <RoleGuard requiredRole="ROLE_ADMIN">
            <InfoCreatePage />
          </RoleGuard>
        }
      />

      {/* /info/:id        -> 상세 페이지 */}
      <Route path=":id" element={<InfoDetailPage />} />

      {/* 매칭 안 되면 목록으로 (선택) */}
      <Route path="*" element={<InfoListPage />} />
    </Routes>
  );
};

export default InfoRoutes;
