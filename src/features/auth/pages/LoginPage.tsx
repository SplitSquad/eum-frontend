import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
  Fade,
} from '@mui/material';
import styled from '@emotion/styled';
import GoogleLoginButton from '../components/GoogleLoginButton';
import useAuthStore from '../store/authStore';

// 봄 테마 스타일의 배경
const SpringBackground = styled(Box)`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(255, 245, 245, 1) 0%, rgba(255, 235, 235, 1) 100%);
  padding: 2rem 0;
  position: relative;
  overflow: hidden;

  /* 배경 꽃잎 효과 */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD7D7'%3E%3Cpath d='M12 1C8.13 1 5 4.13 5 8c0 6 7 15 7 15s7-9 7-15c0-3.87-3.13-7-7-7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.2;
  }

  &::before {
    top: 10%;
    left: 10%;
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    bottom: 10%;
    right: 10%;
    animation: float 15s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(10deg);
    }
  }
`;

// 로그인 카드 스타일
const LoginCard = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 235, 235, 0.8);
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
`;

// 로고 영역
const LogoContainer = styled(Box)`
  margin-bottom: 2rem;
`;

// 페이지 제목 스타일
const PageTitle = styled(Typography)`
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

// 부제목 스타일
const Subtitle = styled(Typography)`
  color: #777;
  margin-bottom: 2rem;
`;

/**
 * 로그인 페이지 컴포넌트
 * 봄 테마를 적용한 디자인으로 구글 로그인 기능 제공
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, handleLogin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // 이미 로그인되어 있으면 메인 페이지로 리디렉션
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = (response: any) => {
    try {
      // 로그인 응답에서 토큰과 사용자 정보 추출
      const { token, user } = response;

      if (!token || !user) {
        throw new Error('로그인 정보가 올바르지 않습니다.');
      }

      // 전역 상태에 로그인 정보 저장
      handleLogin(token, user);

      // 홈페이지로 리디렉션
      navigate('/');
    } catch (err) {
      setError('로그인 처리 중 오류가 발생했습니다.');
      console.error('로그인 처리 실패:', err);
    }
  };

  const handleLoginError = (error: any) => {
    setError('구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    console.error('구글 로그인 오류:', error);
  };

  return (
    <SpringBackground>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 4rem)',
          }}
        >
          <Fade in={true} timeout={1000}>
            <LoginCard elevation={3}>
              <LogoContainer>
                {/* TODO: 실제 로고로 교체 */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#FF9999',
                    fontFamily: '"Roboto", "Noto Sans KR", sans-serif',
                  }}
                >
                  봄날의 기억
                </Typography>
              </LogoContainer>

              <PageTitle variant={isMobile ? 'h5' : 'h4'}>환영합니다</PageTitle>

              <Subtitle variant="body1">구글 계정으로 간편하게 로그인하세요</Subtitle>

              {error && (
                <Box mb={3}>
                  <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                  </Alert>
                </Box>
              )}

              <Box
                sx={{
                  width: '100%',
                  mt: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <GoogleLoginButton
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  buttonText="구글 계정으로 로그인"
                />
              </Box>

              <Box mt={4}>
                <Typography variant="caption" color="textSecondary">
                  로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
                </Typography>
              </Box>
            </LoginCard>
          </Fade>
        </Box>
      </Container>
    </SpringBackground>
  );
};

export default LoginPage;
