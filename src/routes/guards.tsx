import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { useAuthStore } from '../features/auth';
import Loading from '@/pages/Loading';

// 기존 임시 useAuth 함수 제거 (AuthStore로 대체)

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 인증 가드 - 로그인한 사용자만 접근 가능
 * @param children 보호할 컴포넌트
 *
 * TODO: 백엔드 API 연동 시 실제 인증 상태 검증 로직 구현 필요
 */
export async function requireAuth({ request }: LoaderFunctionArgs) {
  const { isAuthenticated, user } = useAuthStore.getState();
  console.log('isAuthenticated', isAuthenticated);
  if (!isAuthenticated) {
    // 로그인 안 된 유저는 구글 로그인 페이지로
    const url = new URL(request.url);
    return redirect(`/google-login?from=${encodeURIComponent(url.pathname)}`);
  }
  return null;
}
export async function requireUser({ request }: LoaderFunctionArgs) {
  let { isAuthenticated, user } = useAuthStore.getState();

  // user가 undefined/null이거나 isOnBoardDone이 undefined면 최대 10번(500ms)까지 대기
  let tries = 0;
  while ((!user || user.isOnBoardDone === undefined) && tries < 10) {
    await new Promise(res => setTimeout(res, 50));
    ({ isAuthenticated, user } = useAuthStore.getState());
    tries++;
  }

  console.log('isAuthenticated', isAuthenticated);
  if (!isAuthenticated) {
    // 로그인 안 된 유저는 구글 로그인 페이지로
    const url = new URL(request.url);
    return redirect(`/google-login?from=${encodeURIComponent(url.pathname)}`);
  }
  if (!user?.isOnBoardDone) {
    console.log('user?.isOnBoardDone', user?.isOnBoardDone);
    const url = new URL(request.url);
    return redirect(`/onboarding?from=${encodeURIComponent(url.pathname)}`);
  }
  return null;
}
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, user, isLoading, loadUser } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 인증 상태 확인
    const checkAuthentication = async () => {
      try {
        // 인증 상태가 불확실한 경우 백엔드에서 사용자 정보 로드
        if (user === undefined && !isLoading) {
          await loadUser();
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuthentication();
  }, [user, isLoading, loadUser]);

  if (isLoading || isChecking || user === undefined) {
    // 인증 확인 중에는 로딩 상태 표시
    return <Loading />;
  }

  if (!isAuthenticated) {
    // 비로그인 상태면 로그인 페이지로 리다이렉트 (현재 위치 정보 저장)
    return <Navigate to="/google-login" state={{ from: location }} replace />;
  }

  // 인증된 사용자는 자식 컴포넌트 렌더링
  return <>{children}</>;
};

interface GuestGuardProps {
  children: ReactNode;
}

/**
 * 게스트 가드 - 비로그인 사용자만 접근 가능 (로그인, 회원가입 등)
 * @param children 보호할 컴포넌트
 */
export const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // 이미 로그인했으면 홈 또는 이전 페이지로 리다이렉트
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }

  // 비로그인 사용자는 자식 컴포넌트 렌더링
  return <>{children}</>;
};

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: string;
}

/**
 * 역할 가드 - 특정 역할을 가진 사용자만 접근 가능 (관리자 페이지 등)
 * @param children 보호할 컴포넌트
 * @param requiredRole 필요한 역할 (예: 'admin')
 */
export const RoleGuard = ({ children, requiredRole }: RoleGuardProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 비로그인 상태면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/google-login" state={{ from: location }} replace />;
  }

  // 필요한 역할이 없으면 접근 거부 페이지로 리다이렉트
  if (user?.role !== requiredRole) {
    return <Navigate to="/access-denied" replace />;
  }

  // 인증 및 권한 검사를 통과한 사용자는 자식 컴포넌트 렌더링
  return <>{children}</>;
};
