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
import { useThemeStore } from '@/features/theme/store/themeStore';
import { seasonalColors } from '@/components/layout/springTheme';

const TransparentSnackbar = styled('div')<{ color: string }>(({ color }) => ({
  borderRadius: 10,
  padding: '10px 16px',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#fff',
  background: color,
  boxShadow: '0 4px 16px rgba(255, 170, 165, 0.15)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

// 로그인 카드 스타일
const LoginCard = styled(Paper)<{ colors: typeof seasonalColors.spring }>`
  padding: 2.5rem 2rem;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background: ${({ colors }) => colors.background};
  border: 1.5px solid ${({ colors }) => colors.primary};
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  transition:
    background 0.3s,
    border 0.3s;
`;

// 로고 영역
const LogoContainer = styled(Box)`
  margin-bottom: 2rem;
`;

// 페이지 제목 스타일
const PageTitle = styled(Typography)<{ color: string }>`
  color: ${({ color }) => color};
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

// 부제목 스타일
const Subtitle = styled(Typography)<{ color: string }>`
  color: ${({ color }) => color};
  margin-bottom: 2rem;
`;

/**
 * 로그인 페이지 컴포넌트
 * 봄 테마를 적용한 디자인으로 구글 로그인 기능 제공
 */
const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user, token, handleLogin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [qs] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const season = useThemeStore(state => state.season);
  const colors = seasonalColors[season] || seasonalColors.spring;

  // 이미 로그인되어 있으면 메인 페이지로 리디렉션
  useEffect(() => {
    if (isAuthenticated === undefined || user === undefined) return;
    if (isAuthenticated && token) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, token, navigate]);

  useEffect(() => {
    if (qs.has('from')) {
      enqueueSnackbar(t('auth.loginRequired'), {
        variant: 'warning',
        autoHideDuration: 1500,
        content: (key, message) => (
          <TransparentSnackbar id={key as string} color={colors.primary}>
            {message}
          </TransparentSnackbar>
        ),
      });
    }
  }, [qs, enqueueSnackbar, colors.primary, t]);

  const handleLoginSuccess = (response: any) => {
    try {
      const { token, user } = response;
      if (!token || !user) {
        throw new Error(t('auth.invalidLoginInfo'));
      }
      handleLogin(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(t('auth.loginError'));
      console.error('로그인 처리 실패:', err);
    }
  };

  const handleLoginError = (error: any) => {
    setError(t('auth.googleLoginError'));
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
          transition: 'background 0.3s',
        }}
      >
        <Fade in={true} timeout={1000}>
          <LoginCard elevation={3} colors={colors}>
            <LogoContainer>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: colors.primary,
                  fontFamily: 'Roboto, Noto Sans KR, sans-serif',
                }}
              ></Typography>
            </LogoContainer>

            <PageTitle variant={isMobile ? 'h5' : 'h4'} color={colors.primary}>
              {t('auth.welcome')}
            </PageTitle>

            <Subtitle variant="body1" color={colors.text}>
              {t('auth.loginDescription')}
            </Subtitle>

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
                background: colors.hover,
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
                buttonText={t('auth.loginWithGoogle')}
              />
              <LoginButton buttonText={t('auth.loginWithGeneral')} />
            </Box>

            <Box mt={4}>
              <Typography variant="caption" color={colors.secondary}>
                {t('auth.termsAgreement')}
              </Typography>
            </Box>
          </LoginCard>
        </Fade>
      </Box>
    </Container>
  );
};

export default LoginPage;
