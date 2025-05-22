import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { InfoListPage, InfoCreatePage, InfoDetailPage } from '../pages';
import AppLayout from '@/components/layout/AppLayout';
export const InfoRoutes: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        {/* /info/           -> 목록 */}
        <Route path="" element={<InfoListPage />} />

        {/* /info/create     -> 글 쓰기 */}
        <Route path="create" element={<InfoCreatePage />} />

        {/* /info/edit/:id   -> 글 수정 */}
        <Route path="edit/:id" element={<InfoCreatePage />} />

        {/* /info/:id        -> 상세 페이지 */}
        <Route path=":id" element={<InfoDetailPage />} />

        {/* 매칭 안 되면 목록으로 (선택) */}
        <Route path="*" element={<InfoListPage />} />
      </Routes>
    </AppLayout>
  );
};

export default InfoRoutes;
