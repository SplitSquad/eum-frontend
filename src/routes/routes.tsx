import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { AuthGuard, GuestGuard, RoleGuard, requireAuth, requireUser } from './guards';
// import TempAuthPage from '../features/auth/pages/TempAuthPage'; // 임시 로그인 제거
import { OAuthCallbackPage, AccessDeniedPage } from '../features/auth';
import LoginPage from '../pages/LoginPage';
import { LanguageProvider } from '../features/theme';
import AiAssistant from '@/tests/unit/componentPageTest/testPages/AiAssistant';
import SignUpPage from '@/features/auth/pages/SignUpPage';
import Loading from '@/pages/Loading';

// 커뮤니티 기능 임포트
// import { PostListPage, PostDetailPage, PostCreatePage } from '../features/community/pages';
import { CommunityRoutes } from '../features/community';

// 토론 기능 임포트
import { DebateRoutes } from '../features/debate';

// 마이페이지 기능 임포트
import { MypageRoutes } from '../features/mypage';
import NormalLogin from '@/features/auth/pages/NormalLogin';
import { InfoRoutes } from '@/features/info/utils';

// 관리자페이지 기능 임포트
import { AdminpageRoutes } from '../features/adminpage';

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
const Init = lazy(() => import('../pages/LoadingOverLay'));

/**
 * 로딩 화면
 */
const LoadingFallback = () => <Loading />;

/**
 * 라우터 설정
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/init" replace />,
      },
      {
        path: '/init',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Init isLoaded={false} />
          </Suspense>
        ),
      },
      {
        path: '/google-login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GuestGuard>
              <NormalLogin />
            </GuestGuard>
          </Suspense>
        ),
      },
      {
        path: '/signup',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GuestGuard>
              <SignUpPage />
            </GuestGuard>
          </Suspense>
        ),
      },
      {
        path: '/auth/callback',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OAuthCallbackPage />
          </Suspense>
        ),
      },
      {
        loader: requireAuth,
        children: [
          {
            path: '/onboarding/*',
            element: (
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <OnboardingRoutes />
                </Suspense>
              </AuthGuard>
            ),
          },
        ],
      },
      {
        loader: requireUser,
        children: [
          {
            path: '/home',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: '/community/*',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CommunityRoutes />
              </Suspense>
            ),
          },
          {
            path: '/debate/*',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <DebateRoutes />
              </Suspense>
            ),
          },
          {
            path: 'info/*',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <InfoRoutes />
              </Suspense>
            ),
          },
          {
            path: '/assistant',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AiAssistant />
              </Suspense>
            ),
          },
          {
            path: '/mypage/*',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <MypageRoutes />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '/access-denied',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AccessDeniedPage />
          </Suspense>
        ),
      },
      {
        path: '/adminpage/*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            {/* <AuthGuard> */}
            <AdminpageRoutes />
            {/* </AuthGuard> */}
          </Suspense>
        ),
      },
      {
        path: '/404',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
      {
        path: '/403',
        element: <Navigate to="/access-denied" replace />,
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);

/**
 * 애플리케이션 라우트 컴포넌트
 */
const Routes = () => {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
};

export default Routes;
