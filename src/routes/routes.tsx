import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { AuthGuard, GuestGuard, RoleGuard } from './guards';
// import TempAuthPage from '../features/auth/pages/TempAuthPage'; // 임시 로그인 제거
import { LoginPage, OAuthCallbackPage, AccessDeniedPage } from '../features/auth';
import Profile from '../pages/Profile';
import { LanguageProvider } from '../features/theme';
import AiAssistant from '@/tests/unit/componentPageTest/testPages/AiAssistant';

import { AdminpageRoutes } from '../features/adminpage';

// 커뮤니티 기능 임포트
// import { PostListPage, PostDetailPage, PostCreatePage } from '../features/community/pages';
import { CommunityRoutes } from '../features/community';

// 토론 기능 임포트
import { DebateRoutes } from '../features/debate';

// 마이페이지 기능 임포트
import { MypageRoutes } from '../features/mypage';

// 온보딩 라우트 컴포넌트 임포트
const OnboardingRoutes = lazy(() => import('../features/onboarding/routes/OnboardingRoutes'));

// 레이아웃
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
const Loading = lazy(() => import('../pages/Loading'));

/**
 * 로딩 화면
 */
const LoadingFallback = () => <div>로딩 중...</div>;

/**
 * 라우터 설정
 */
const router = createBrowserRouter([
  // 초기 로딩 화면을 메인 경로로 설정 - 이 로딩 화면에서 인증 상태를 확인하여 홈/로그인으로 리다이렉트
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Loading />
      </Suspense>
    ),
  },

  // 앱 메인 레이아웃 - 로그인 후 여기로 오는 페이지들
  {
    path: '',
    element: <AppLayout />,
    children: [
      // 홈 (로그인 필요로 변경)
      {
        path: 'home',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },

      // 실제 구글 로그인 페이지
      {
        path: 'google-login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          </Suspense>
        ),
      },

      // OAuth 콜백 처리
      {
        path: 'auth/callback',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OAuthCallbackPage />
          </Suspense>
        ),
      },

      // 접근 거부 페이지
      {
        path: 'access-denied',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AccessDeniedPage />
          </Suspense>
        ),
      },

      /* 아직 구현되지 않은 페이지 주석 처리
      // 온보딩 (비회원만 접근 가능)
      {
        path: 'onboarding',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GuestGuard>
              <Onboarding />
            </GuestGuard>
          </Suspense>
        ),
      },
      */

      // 온보딩 (로그인 필요)
      {
        path: 'onboarding/*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OnboardingRoutes />
          </Suspense>
        ),
      },

      // 커뮤니티 (로그인 필요)
      {
        path: 'community/*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard>
              <CommunityRoutes />
            </AuthGuard>
          </Suspense>
        ),
      },

      // 관리자 (로그인 필요 x)
      {
        path: 'adminpage/*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminpageRoutes />
          </Suspense>
        ),
      },

      // 토론 (로그인 필요)
      {
        path: 'debate/*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard>
              <DebateRoutes />
            </AuthGuard>
          </Suspense>
        ),
      },

      /* 아직 구현되지 않은 페이지 주석 처리
      // 정보 (누구나 접근 가능)
      {
        path: 'info',
        children: [
          {
            path: '',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Info />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <InfoDetail />
              </Suspense>
            ),
          },
        ],
      },*/

      // AI 비서 (로그인 필요)
      {
        path: 'assistant',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard>
              <AiAssistant />
            </AuthGuard>
          </Suspense>
        ),
      },

      // 마이페이지 (로그인 필요)
      {
        path: 'mypage/*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard>
              <MypageRoutes />
            </AuthGuard>
          </Suspense>
        ),
      },

      /* 아직 구현되지 않은 페이지 주석 처리
      // 검색 (누구나 접근 가능)
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Search />
          </Suspense>
        ),
      },

      // 관리자 페이지 (관리자 역할 필요)
      {
        path: 'admin',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RoleGuard requiredRole="admin">
              <div>관리자 페이지</div>
            </RoleGuard>
          </Suspense>
        ),
      },
      */

      // 404 페이지
      {
        path: '404',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        ),
      },

      // 403 페이지 (접근 거부 - 기존 URL 패턴 지원)
      {
        path: '403',
        element: <Navigate to="/access-denied" replace />,
      },

      // 알 수 없는 경로는 404로 리다이렉트
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
