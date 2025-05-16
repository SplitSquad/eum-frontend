import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 페이지 컴포넌트들
import { PostListPage, PostDetailPage, PostCreatePage } from './pages';

/**
 * 커뮤니티 서브 라우트
 * 커뮤니티 내의 다양한 페이지들을 라우팅합니다.
 */
export const CommunityRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PostListPage />} />
      <Route path="/groups" element={<PostListPage />} />
      <Route path="/board" element={<PostListPage />} />
      <Route path="/create" element={<PostCreatePage />} />
      <Route path="/edit/:postId" element={<PostCreatePage />} />
      <Route path="/:postId" element={<PostDetailPage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />
    </Routes>
  );
};

export default CommunityRoutes;
