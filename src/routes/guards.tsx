import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { useAuthStore } from '../features/auth';
import Loading from '@/pages/Loading';
import { getValidToken, removeToken } from '../features/auth/tokenUtils';

// 기존 임시 useAuth 함수 제거 (AuthStore로 대체)

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 인증 가드 - 로그인한 사용자만 접근 가능
 * @param children 보호할 컴포넌트
 */
export async function requireAuth({ request }: LoaderFunctionArgs) {
  let { isAuthenticated, user, isLoading } = useAuthStore.getState();

  // 인증 상태가 확정될 때까지 대기 (requireUser와 동일)
  let tries = 0;
  while ((user === undefined || isAuthenticated === undefined || isLoading) && tries < 100) {
    await new Promise(res => setTimeout(res, 50));
    ({ isAuthenticated, user, isLoading } = useAuthStore.getState());
    tries++;
  }
  if (user === undefined || isAuthenticated === undefined || isLoading) {
    console.log('requireAuth: 인증 상태가 확정되지 않았습니다 에서 걸린 로딩 .');
    return <Loading />;
  }
  if (!isAuthenticated) {
    const url = new URL(request.url);
    return redirect(`/google-login?from=${encodeURIComponent(url.pathname)}`);
  }
  return null;
}
export async function requireUser({ request }: LoaderFunctionArgs) {
  let { isAuthenticated, user, isLoading } = useAuthStore.getState();

  // 인증 상태가 확정될 때까지 대기
  let tries = 0;
  while ((user === undefined || isAuthenticated === undefined || isLoading) && tries < 5) {
    await new Promise(res => setTimeout(res, 10));
    ({ isAuthenticated, user, isLoading } = useAuthStore.getState());
    tries++;
  }
  if (!isAuthenticated) {
    const url = new URL(request.url);
    return redirect(`/google-login?from=${encodeURIComponent(url.pathname)}`);
  }
  if (!user?.isOnBoardDone) {
    const url = new URL(request.url);
    return redirect(`/onboarding?from=${encodeURIComponent(url.pathname)}`);
  }
  return null;
}
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, user, isLoading, loadUser, clearAuthState } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // 인증 상태 확인
    const checkAuthentication = async () => {
      try {
        // 먼저 유효한 토큰이 있는지 확인
        const validToken = getValidToken();

        if (!validToken) {
          // 유효한 토큰이 없으면 인증 상태 정리하고 리다이렉트
          console.log('AuthGuard: 유효한 토큰이 없습니다. 인증 상태를 정리합니다.');
          clearAuthState();
          setShouldRedirect(true);
          return;
        }

        // 인증 상태가 불확실한 경우 백엔드에서 사용자 정보 로드
        if (!isAuthenticated && !isLoading) {
          console.log('AuthGuard: 사용자 정보를 로드합니다.');
          await loadUser();
        }
      } catch (error) {
        console.error('AuthGuard: 인증 상태 확인 실패:', error);
        // 에러 발생 시 인증 상태 정리
        clearAuthState();
        setShouldRedirect(true);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuthentication();
  }, [isAuthenticated, isLoading, loadUser, clearAuthState]);

  if (isLoading || isChecking || user === undefined || isAuthenticated === undefined) {
    // 인증 확인 중에는 로딩 상태 표시
    console.log('AuthGuard: 인증 확인 중에는 로딩 상태 표시');
    return <Loading />;
  }

  if (shouldRedirect || !isAuthenticated) {
    // 비로그인 상태거나 리다이렉트가 필요한 경우 로그인 페이지로 이동
    console.log('AuthGuard: 로그인 페이지로 리다이렉트합니다.');
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
  const { isAuthenticated, clearAuthState } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 토큰 유효성 확인
    const checkTokenValidity = () => {
      const validToken = getValidToken();

      if (!validToken && isAuthenticated) {
        // 토큰이 유효하지 않은데 인증 상태가 true라면 상태 정리
        console.log('GuestGuard: 토큰이 유효하지 않아 인증 상태를 정리합니다.');
        clearAuthState();
      }

      setIsChecking(false);
    };

    checkTokenValidity();
  }, [isAuthenticated, clearAuthState]);

  if (isChecking) {
    return <div>인증 상태 확인 중...</div>;
  }

  // 유효한 토큰이 있고 인증된 상태라면 홈 또는 이전 페이지로 리다이렉트
  const validToken = getValidToken();
  if (validToken && isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    console.log('GuestGuard: 이미 로그인된 사용자입니다. 홈으로 리다이렉트합니다.');
    return <Navigate to={from} replace />;
  }

  // 4. 비로그인 사용자는 자식 컴포넌트 렌더링
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

  // 먼저 유효한 토큰 확인
  const validToken = getValidToken();
  if (!validToken) {
    return <Navigate to="/google-login" state={{ from: location }} replace />;
  }

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
