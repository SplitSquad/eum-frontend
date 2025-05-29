import styled from '@emotion/styled';
import {
  Alert,
  Box,
  Container,
  Fade,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton';
import useAuthStore from '../features/auth/store/authStore';
import LoginButton from '../features/auth/components/LoginButton';
import { useSnackbar } from 'notistack';
import { useTranslation } from '@/shared/i18n';

const TransparentSnackbar = styled('div')(() => ({
  borderRadius: 10,
  padding: '10px 16px',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#fff',
  background: 'rgba(255,182,193,0.85)', // 반투명 분홍색
  boxShadow: '0 4px 16px rgba(255, 170, 165, 0.15)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

const { t } = useTranslation();
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
  const { isAuthenticated, user, token, handleLogin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [qs] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  // 이미 로그인되어 있으면 메인 페이지로 리디렉션
  useEffect(() => {
    // 인증 상태가 확정되지 않았으면 대기
    if (isAuthenticated === undefined || user === undefined) return;

    // 인증 상태가 true이고 토큰이 있으면 홈으로 이동
    if (isAuthenticated && token) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, token, navigate]);

  useEffect(() => {
    if (qs.has('from')) {
      enqueueSnackbar(t('common.authenticatedError'), {
        variant: 'warning',
        autoHideDuration: 1500,
        content: (key, message) => (
          <TransparentSnackbar id={key as string}>{message}</TransparentSnackbar>
        ),
      });
    }
  }, [qs, enqueueSnackbar]);

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
      navigate('/dashboard');
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
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 4rem)',
          position: 'relative',
          zIndex: 10,
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
                background: 'linear-gradient(135deg,rgb(252, 237, 241) 0%,rgb(255, 240, 246) 100%)',
                borderRadius: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <GoogleLoginButton
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                buttonText="구글 계정으로 로그인"
              />
              <LoginButton buttonText="일반 계정으로 로그인" />
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
  );
};

export default LoginPage;
