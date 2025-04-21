import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { AuthGuard, GuestGuard, RoleGuard } from './guards';
import TempAuthPage from '../features/auth/pages/TempAuthPage';
// 직접 임포트 (지연 로딩 없이)
import { LoginPage, OAuthCallbackPage, AccessDeniedPage } from '../features/auth';
import Profile from '../pages/Profile';

// 커뮤니티 기능 임포트
import { PostListPage, PostDetailPage, PostCreatePage } from '../features/community/pages';

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
const MyPage = lazy(() => import('../pages/MyPage'));
const Search = lazy(() => import('../pages/Search'));
const Onboarding = lazy(() => import('../pages/Onboarding'));
*/
const NotFound = lazy(() => import('../pages/NotFound'));
const Loading = lazy(() => import('../pages/Loading'));

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
      // 홈 (로그인 필요로 변경)
      {
        path: '',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },

      // 로그인/회원가입 (비회원만 접근 가능)
      // TODO: 현재 임시 로그인. 실제로 로그인 페이지로 이동 후 주석 처리 필요
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            {/* <GuestGuard> */}
            <TempAuthPage />
            {/* </GuestGuard> */}
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

      // 커뮤니티 (로그인 필요)
      {
        path: 'community',
        children: [
          {
            path: '',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthGuard>
                  <PostListPage />
                </AuthGuard>
              </Suspense>
            ),
          },
          {
            path: 'create',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthGuard>
                  <PostCreatePage />
                </AuthGuard>
              </Suspense>
            ),
          },
          {
            path: 'edit/:postId',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthGuard>
                  <PostCreatePage />
                </AuthGuard>
              </Suspense>
            ),
          },
          {
            path: ':postId',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthGuard>
                  <PostDetailPage />
                </AuthGuard>
              </Suspense>
            ),
          },
          {
            path: 'post/:id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthGuard>
                  <PostDetailPage />
                </AuthGuard>
              </Suspense>
            ),
          },
        ],
      },

      /* 아직 구현되지 않은 페이지 주석 처리
      // 토론 (로그인 필요)
      {
        path: 'debate',
        children: [
          {
            path: '',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthGuard>
                  <Debate />
                </AuthGuard>
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthGuard>
                  <DebateDetail />
                </AuthGuard>
              </Suspense>
            ),
          },
        ],
      },

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
      },

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
        path: 'mypage',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard>
              <MyPage />
            </AuthGuard>
          </Suspense>
        ),
      },
      */

      // 프로필 페이지 (로그인 필요)
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthGuard>
              <Profile />
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
 * 라우터 프로바이더 컴포넌트
 */
const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
