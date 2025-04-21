import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container, Alert } from '@mui/material';
import { handleOAuthCallback } from '../api/authApi';
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
 * OAuth 콜백 처리 페이지
 * Google 인증 후 리디렉션되는 페이지로, 코드를 추출하여 인증 처리
 */
const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { handleLogin } = useAuthStore();

  useEffect(() => {
    // URL에서 code와 provider 파라미터 추출
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const provider = params.get('provider') || 'google'; // 기본값은 google
    const state = params.get('state'); // 보안용 state 파라미터 (선택적)

    if (!code) {
      setError('인증 코드가 없습니다. 로그인을 다시 시도해주세요.');
      return;
    }

    // 인증 코드로 로그인 처리
    const processAuthentication = async () => {
      try {
        const authResult = await handleOAuthCallback(code, provider);

        // 로그인 정보 스토어에 저장
        if (authResult && authResult.token && authResult.user) {
          handleLogin(authResult.token, authResult.user);
          navigate('/'); // 인증 성공 후 메인 페이지로 이동
        } else {
          throw new Error('로그인 정보가 올바르지 않습니다.');
        }
      } catch (err) {
        console.error('인증 처리 실패:', err);
        setError('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    processAuthentication();
  }, [location, navigate, handleLogin]);

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
              <a href="/login" style={{ color: '#FF7777', textDecoration: 'none' }}>
                로그인 페이지로 돌아가기
              </a>
            </Typography>
          </Box>
        </Container>
      ) : (
        <>
          <CircularProgress size={60} thickness={4} sx={{ color: '#FF9999' }} />
          <LoadingMessage variant="h6">로그인 처리 중입니다...</LoadingMessage>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 2, maxWidth: '400px', textAlign: 'center', opacity: 0.7 }}
          >
            잠시만 기다려주세요. 구글 계정 정보를 확인하고 있습니다.
          </Typography>
        </>
      )}
    </LoadingContainer>
  );
};

export default OAuthCallbackPage;
