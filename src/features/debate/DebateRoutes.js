import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import DebateListPage from './pages/DebateListPage';
import DebateDetailPage from './pages/DebateDetailPage';
import MainIssuesPage from './pages/MainIssuesPage';
/**
 * 토론 기능의 라우팅을 관리하는 컴포넌트
 */
const DebateRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(MainIssuesPage, {}) }), _jsx(Route, { path: "/list", element: _jsx(DebateListPage, {}) }), _jsx(Route, { path: "/:id", element: _jsx(DebateDetailPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/debate", replace: true }) })] }));
};
export default DebateRoutes;
