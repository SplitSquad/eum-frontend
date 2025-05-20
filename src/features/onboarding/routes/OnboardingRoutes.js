import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthGuard } from '../../../routes/guards'; // 제거
import Loading from '../../../pages/Loading';
// 온보딩 페이지 지연 로딩
const PurposeSelection = lazy(() => import('../pages/PurposeSelection'));
const StudyProfile = lazy(() => import('../pages/StudyProfile'));
const TravelProfile = lazy(() => import('../pages/TravelProfile'));
const JobProfile = lazy(() => import('../pages/JobProfile'));
const LivingProfile = lazy(() => import('../pages/LivingProfile'));
/**
 * 로딩 화면
 */
const LoadingFallback = () => _jsx(Loading, {});
/**
 * 온보딩 경로 라우팅 컴포넌트
 * 로그인된 사용자에게만 표시됩니다.
 */
const OnboardingRoutes = () => {
    return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PurposeSelection, {}) }), _jsx(Route, { path: "/study", element: _jsx(StudyProfile, {}) }), _jsx(Route, { path: "/travel", element: _jsx(TravelProfile, {}) }), _jsx(Route, { path: "/job", element: _jsx(JobProfile, {}) }), _jsx(Route, { path: "/living", element: _jsx(LivingProfile, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/onboarding", replace: true }) })] }) }));
};
export default OnboardingRoutes;
