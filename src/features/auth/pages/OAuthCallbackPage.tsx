import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container, Alert } from '@mui/material';
import { handleOAuthCallback } from '../api/authApi';
import useAuthStore from '../store/authStore';
import styled from '@emotion/styled';
import { getToken } from '../tokenUtils';

// 로딩 컨테이너 스타일
const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 245, 245, 1) 0%, rgba(255, 235, 235, 1) 100%);
`;

// 로딩 메시지 애니메이션
const LoadingMessage = styled(Typography)`
  margin-top: 2rem;
  opacity: 0.8;
  animation: pulse 1.5s infinite ease-in-out;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`;

/**
 * JWT 토큰 디코딩 헬퍼 함수
 */
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

/**
 * OAuth 콜백 처리 페이지
 * Google 인증 후 리디렉션되는 페이지
 */
const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setAuthState, handleLogin } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const fetchToken = async () => {
      // URL 쿼리스트링에서 코드 추출
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      
      if (code) {
        try {
          setStatus('loading');
          console.log('인증 코드로 토큰 요청 중...');
          
          // 백엔드에 인증 코드 전송하여 토큰 및 사용자 정보 획득
          const data = await handleOAuthCallback(code);

          // 토큰 정보 저장 및 로그인 상태 업데이트
          if (data && data.user && data.token) {
            console.log('로그인 성공:', data);
            console.log('받은 토큰:', data.token.substring(0, 20) + '...');
            
            // 직접 로컬 스토리지에 저장 (중복 저장이지만 안전을 위해)
            localStorage.setItem('auth_token', data.token);
            console.log('토큰 저장 후 확인:', localStorage.getItem('auth_token') ? '토큰 저장됨' : '토큰 저장 실패');
            
            // User 객체 형식으로 변환하여 상태 업데이트
            const userInfo = {
              userId: data.user.userId || 0,
              email: data.user.email,
              role: data.user.role || 'user',
              isNewUser: data.user.isNewUser || false,
              isOnBoardDone: data.user.isOnBoardDone || false,
              name: data.user.name,
              picture: data.user.picture,
              googleId: data.user.googleId
            };
            
            // handleLogin을 사용하여 토큰과 사용자 정보를 함께 저장
            handleLogin(data.token, userInfo);
            
            // 인증 테스트: 토큰이 유효한지 확인하기 위한 간단한 요청
            try {
              // axios 인스턴스 임포트 필요
              const { axiosInstance } = await import('../../../config/axios');
              console.log('인증 테스트 요청 시작...');
              
              // 두 번째 확인 - 로컬 스토리지 토큰 확인
              const storedToken = localStorage.getItem('auth_token');
              console.log('테스트 요청 전 저장된 토큰 확인:', storedToken ? '토큰 있음' : '토큰 없음');
              
              const testResponse = await axiosInstance.get('/auth/test', {
                headers: { 
                  'Authorization': `${data.token}`
                }
              });
              console.log('인증 테스트 성공:', testResponse);
            } catch (testError) {
              console.error('인증 테스트 실패:', testError);
              // 테스트 실패해도 계속 진행
            }
            
            setStatus('success');
            
            // 신규 사용자이거나 온보딩이 완료되지 않은 경우 온보딩 페이지로
            if (userInfo.isNewUser || !userInfo.isOnBoardDone) {
              navigate('/onboarding', { replace: true });
            } else {
              // 기존 사용자는 홈페이지로 (/ 대신 /home으로 직접 이동)
              navigate('/home', { replace: true });
            }
          } else {
            console.error('로그인 실패: 유저 정보가 없음');
            setError('유저 정보를 받지 못했습니다.');
            setStatus('error');
          }
        } catch (err) {
          console.error('로그인 에러:', err);
          setError('로그인 처리 중 오류가 발생했습니다.');
          setStatus('error');
        }
      } else {
        console.error('인증 코드를 찾을 수 없습니다.');
        setError('인증 코드를 찾을 수 없습니다.');
        setStatus('error');
      }
    };

    fetchToken();
  }, [location.search, navigate, setAuthState, handleLogin]);

  return (
    <LoadingContainer>
      {error ? (
        <Container maxWidth="sm">
          <Alert
            severity="error"
            sx={{
              mt: 2,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {error}
          </Alert>
          <Box textAlign="center" mt={3}>
            <Typography variant="body1">
              <a href="/google-login" style={{ color: '#FF7777', textDecoration: 'none' }}>
                로그인 페이지로 돌아가기
              </a>
            </Typography>
          </Box>
        </Container>
      ) : (
        <>
          <CircularProgress size={60} sx={{ color: '#FF9999' }} />
          <LoadingMessage variant="h6">로그인 처리 중입니다...</LoadingMessage>
        </>
      )}
    </LoadingContainer>
  );
};

export default OAuthCallbackPage;