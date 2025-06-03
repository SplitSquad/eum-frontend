import React, { useEffect, useState } from 'react';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton';
import useAuthStore from '../features/auth/store/authStore';
import LoginButton from '../features/auth/components/LoginButton';
import { useSnackbar } from 'notistack';
import { useTranslation } from '@/shared/i18n';

// ------------------------------------------------------
// 투명 배경의 스낵바(Custom Snackbar) 스타일
// ------------------------------------------------------
const TransparentSnackbar = styled('div')<{ color: string }>(({ color }) => ({
  borderRadius: 10,
  padding: '10px 16px',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#222',
  background: color,
  boxShadow: '0 4px 16px rgba(255, 170, 165, 0.15)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

// ------------------------------------------------------
// 로그인 카드 스타일 (Paper 기반) - 반응형 추가
// ------------------------------------------------------
const LoginCard = styled(Paper)`
  padding: 2.5rem 2rem;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background: #fafbfc;
  border: 1.5px solid #e0e0e0;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  transition:
    background 0.3s,
    border 0.3s;

  /* 모바일(≤600px)일 때 패딩·너비 축소 */
  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    max-width: 90%;
    border-radius: 14px;
  }
`;

// ------------------------------------------------------
// 로고(혹은 제목) 영역 스타일 - 반응형 추가
// ------------------------------------------------------
const LogoContainer = styled(Box)`
  margin-bottom: 2rem;

  /* 모바일(≤600px)일 때 여백 축소 */
  @media (max-width: 600px) {
    margin-bottom: 1.5rem;
  }
`;

// ------------------------------------------------------
// 페이지 제목 스타일 - 반응형 추가
// ------------------------------------------------------
const PageTitle = styled(Typography)`
  color: #636363;
  margin-bottom: 0.5rem;
  font-weight: 700;

  /* 모바일(≤600px)일 때 폰트 크기 축소 */
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

// ------------------------------------------------------
// 부제목(서브타이틀) 스타일 - 반응형 추가
// ------------------------------------------------------
const Subtitle = styled(Typography)`
  color: #888;
  margin-bottom: 2rem;

  /* 모바일(≤600px)일 때 폰트 크기 축소 */
  @media (max-width: 600px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

/**
 * 로그인 페이지 컴포넌트
 * 반응형을 적용하여 모바일·데스크톱 모두 최적화된 레이아웃 제공
 */
const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  // theme.breakpoints.down('sm') === 600px 기준
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 인증 상태 관리 (zustand)
  const { isAuthenticated, user, token, handleLogin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [qs] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  // 이미 로그인된 상태라면 /dashboard로 리디렉트
  useEffect(() => {
    if (isAuthenticated === undefined || user === undefined) return;
    if (isAuthenticated && token) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, token, navigate]);

  // 쿼리스트링에 from 파라미터가 있으면 경고 스낵바 표시
  useEffect(() => {
    if (qs.has('from')) {
      enqueueSnackbar(t('auth.loginRequired'), {
        variant: 'warning',
        autoHideDuration: 1500,
        content: (key, message) => (
          <TransparentSnackbar id={key as string} color="#fafbfc">
            {message}
          </TransparentSnackbar>
        ),
      });
    }
  }, [qs, enqueueSnackbar, t]);

  // 구글 로그인 성공 핸들러
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
      console.error('Login processing failed:', err);
    }
  };

  // 구글 로그인 실패 핸들러
  const handleLoginError = (error: any) => {
    setError(t('auth.googleLoginError'));
    console.error('Google login error:', error);
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
          // 모바일(≤600px)에서는 좌우 여백을 조금 추가
          px: { xs: 2, sm: 0 },
        }}
      >
        <Fade in={true} timeout={1000}>
          <LoginCard elevation={3}>
            <LogoContainer>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                  fontWeight: 700,
                  color: '#636363',
                  fontFamily: 'Roboto, Noto Sans KR, sans-serif',
                  // 추가적으로 모바일에서 폰트 크기 직접 조정 가능
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                {/*{t('auth.brandName') /* 예: 서비스 로고나 이름 */}
                EUM
              </Typography>
            </LogoContainer>

            <PageTitle variant={isMobile ? 'h5' : 'h4'}>{t('auth.welcome')}</PageTitle>

            <Subtitle variant="body1">{t('auth.loginDescription')}</Subtitle>

            {/* 에러 알림 */}
            {error && (
              <Box mb={3} width="100%">
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Box>
            )}

            {/* 로그인 버튼 박스 */}
            <Box
              sx={{
                width: '100%',
                mt: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
                background: '#fafbfc',
                borderRadius: 3,
                // 모바일·태블릿·데스크톱에서 padding 차등 적용
                p: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                // 모바일에서 버튼 간격을 좁게, 데스크톱에서 넓게
                gap: { xs: 2, sm: 3 },
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
              <Typography
                variant="caption"
                sx={{
                  color: '#bdbdbd',
                  // 모바일에서 글씨를 조금 작게
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                }}
              >
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
