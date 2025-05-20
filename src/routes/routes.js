import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthGuard, GuestGuard } from './guards';
// import TempAuthPage from '../features/auth/pages/TempAuthPage'; // 임시 로그인 제거
import { OAuthCallbackPage, AccessDeniedPage } from '../features/auth';
import LoginPage from '../pages/LoginPage';
import { LanguageProvider } from '../features/theme';
import AiAssistant from '@/tests/unit/componentPageTest/testPages/AiAssistant';
// 커뮤니티 기능 임포트
// import { PostListPage, PostDetailPage, PostCreatePage } from '../features/community/pages';
import { CommunityRoutes } from '../features/community';
// 토론 기능 임포트
import { DebateRoutes } from '../features/debate';
// 마이페이지 기능 임포트
import { MypageRoutes } from '../features/mypage';
// 온보딩 라우트 컴포넌트 임포트
const OnboardingRoutes = lazy(() => import('../features/onboarding/routes/OnboardingRoutes'));
//레이아웃
const AppLayout = lazy(() => import('../app/App'));
// 페이지 컴포넌트 지연 로딩
const Home = lazy(() => import('../pages/Home'));
// const Login = lazy(() => import('../pages/Login')); // 주석 처리 (우리 로그인 페이지로 대체)
// const Community = lazy(() => import('../pages/Community')); // 주석 처리 (features/community로 대체)
// const CommunityDetail = lazy(() => import('../pages/CommunityDetail')); // 주석 처리 (features/community로 대체)
/* 아직 구현되지 않은 페이지들 주석 처리
const Debate = lazy(() => import('../pages/Debate'));
const DebateDetail = lazy(() => import('../pages/DebateDetail'));
const Info = lazy(() => import('../pages/Info'));
const InfoDetail = lazy(() => import('../pages/InfoDetail'));
const AiAssistant = lazy(() => import('../pages/AiAssistant'));
// const MyPage = lazy(() => import('../pages/MyPage')); // 새로운 마이페이지 모듈로 대체
const Search = lazy(() => import('../pages/Search'));
const Onboarding = lazy(() => import('../pages/Onboarding'));
*/
const NotFound = lazy(() => import('../pages/NotFound'));
const Init = lazy(() => import('../components/feedback/LoadingOverLay'));
const Loading = lazy(() => import('../pages/Loading'));
/**
 * 로딩 화면
 */
const LoadingFallback = () => _jsx(Loading, {});
/**
 * 라우터 설정
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(AppLayout, {}),
        children: [
            {
                path: '',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(Init, { isLoaded: false }) })),
            },
            {
                path: '/home',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(Home, {}) })),
            },
            {
                path: '/google-login',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(GuestGuard, { children: _jsx(LoginPage, {}) }) })),
            },
            {
                path: '/auth/callback',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(OAuthCallbackPage, {}) })),
            },
            {
                path: '/access-denied',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(AccessDeniedPage, {}) })),
            },
            {
                path: '/onboarding/*',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(OnboardingRoutes, {}) })),
            },
            {
                path: '/community/*',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(AuthGuard, { children: _jsx(CommunityRoutes, {}) }) })),
            },
            {
                path: '/debate/*',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(AuthGuard, { children: _jsx(DebateRoutes, {}) }) })),
            },
            {
                path: '/assistant',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(AuthGuard, { children: _jsx(AiAssistant, {}) }) })),
            },
            {
                path: '/mypage/*',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(AuthGuard, { children: _jsx(MypageRoutes, {}) }) })),
            },
            {
                path: '/404',
                element: (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsx(NotFound, {}) })),
            },
            {
                path: '/403',
                element: _jsx(Navigate, { to: "/access-denied", replace: true }),
            },
            {
                path: '*',
                element: _jsx(Navigate, { to: "/404", replace: true }),
            },
        ],
    },
]);
/**
 * 애플리케이션 라우트 컴포넌트
 */
const Routes = () => {
    return (_jsx(LanguageProvider, { children: _jsx(RouterProvider, { router: router }) }));
};
export default Routes;
