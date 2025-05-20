import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth';

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
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, user, isLoading, loadUser } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 인증 상태 확인
    const checkAuthentication = async () => {
      try {
        // 인증 상태가 불확실한 경우 백엔드에서 사용자 정보 로드
        if (!isAuthenticated && !isLoading) {
          await loadUser();
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      } finally {
        // 인증 체크가 완료되었음을 표시
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [isAuthenticated, isLoading, loadUser]);

  if (isLoading || isChecking) {
    // 인증 확인 중에는 로딩 상태 표시
    return <div>인증 확인 중...</div>;
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
  const { isAuthenticated, getOnBoardDone } = useAuthStore();
  const location = useLocation();

  // 이미 로그인했으면 홈 또는 온보딩 페이지로 리다이렉트
  if (isAuthenticated) {
    // 온보딩 완료 여부에 따라 적절한 페이지로 리다이렉트
    const isOnBoardDone = getOnBoardDone();
    const redirectPath = isOnBoardDone ? '/home' : '/onboarding';
    return <Navigate to={redirectPath} replace />;
  }

  // 비로그인 사용자는 자식 컴포넌트 렌더링
  return <>{children}</>;
};

interface OnboardingGuardProps {
  children: ReactNode;
}

/**
 * 온보딩 가드 - 온보딩이 필요한 사용자만 접근 가능
 * - 로그인이 필요함
 * - 온보딩을 이미 완료한 사용자는 홈으로 리다이렉트
 * @param children 보호할 컴포넌트
 */
export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { isAuthenticated, getOnBoardDone, isLoading, loadUser } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 인증 상태 확인
    const checkAuthentication = async () => {
      try {
        // 인증 상태가 불확실한 경우 백엔드에서 사용자 정보 로드
        if (!isAuthenticated && !isLoading) {
          await loadUser();
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      } finally {
        // 인증 체크가 완료되었음을 표시
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [isAuthenticated, isLoading, loadUser]);

  if (isLoading || isChecking) {
    // 인증 확인 중에는 로딩 상태 표시
    return <div>인증 확인 중...</div>;
  }

  // 비로그인 상태면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/google-login" state={{ from: location }} replace />;
  }

  // 온보딩 완료 여부 확인
  const isOnBoardDone = getOnBoardDone();

  // 온보딩을 이미 완료했으면 홈으로 리다이렉트
  if (isOnBoardDone) {
    return <Navigate to="/home" replace />;
  }

  // 로그인은 했지만 온보딩이 필요한 사용자는 자식 컴포넌트 렌더링
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
