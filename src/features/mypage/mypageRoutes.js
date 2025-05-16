import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
// 페이지 컴포넌트들
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ActivitiesPage from './pages/ActivitiesPage';
/**
 * 마이페이지 서브 라우트
 * 마이페이지 내의 다양한 페이지들을 라우팅합니다.
 */
export const MypageRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) }), _jsx(Route, { path: "/activities", element: _jsx(ActivitiesPage, {}) })] }));
};
export default MypageRoutes;
