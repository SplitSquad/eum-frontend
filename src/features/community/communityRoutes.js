import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
// 페이지 컴포넌트들
import { PostListPage, PostDetailPage, PostCreatePage } from './pages';
/**
 * 커뮤니티 서브 라우트
 * 커뮤니티 내의 다양한 페이지들을 라우팅합니다.
 */
export const CommunityRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PostListPage, {}) }), _jsx(Route, { path: "/groups", element: _jsx(PostListPage, {}) }), _jsx(Route, { path: "/board", element: _jsx(PostListPage, {}) }), _jsx(Route, { path: "/create", element: _jsx(PostCreatePage, {}) }), _jsx(Route, { path: "/edit/:postId", element: _jsx(PostCreatePage, {}) }), _jsx(Route, { path: "/:postId", element: _jsx(PostDetailPage, {}) }), _jsx(Route, { path: "/post/:id", element: _jsx(PostDetailPage, {}) })] }));
};
export default CommunityRoutes;
