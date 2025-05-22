import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import useAuthStore from '../store/authStore';
import styled from '@emotion/styled';

// 로딩 컨테이너 스타일
const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 245, 245, 0.8) 0%, rgba(255, 235, 235, 0.8) 100%);
`;

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

/**
 * 인증 가드 컴포넌트
 *
 * 로그인 상태를 확인하고 인증되지 않은 사용자를 로그인 페이지로 리디렉션
 * 또한 requiredRoles 배열이 주어진 경우 사용자의 권한도 확인
 *
 * TODO: 백엔드 API와 연동하여 실제 인증 상태 검증 필요
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading, loadUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 사용자 정보 로드 및 인증 상태 확인
    const checkAuthentication = async () => {
      try {
        // 인증 상태가 불확실한 경우 백엔드에서 사용자 정보 로드
        if (!isAuthenticated && !isLoading) {
          await loadUser();
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [isAuthenticated, isLoading, loadUser]);

  // 인증 상태 확인 중
  if (isLoading || isChecking) {
    return (
      <LoadingContainer>
        <CircularProgress size={50} thickness={4} sx={{ color: '#FF9999' }} />
        <Typography mt={3} variant="body1" color="textSecondary">
          인증 확인 중...
        </Typography>
      </LoadingContainer>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated) {
    return <Navigate to="/google-login" state={{ from: location }} replace />;
  }

  // 권한 확인이 필요한 경우
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);

    // 권한이 없는 경우 접근 거부 페이지로 리디렉션
    if (!hasRequiredRole) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  // 모든 조건 통과 시 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AuthGuard;
