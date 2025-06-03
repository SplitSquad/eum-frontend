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
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { loginUser } from '../api/authApi';
import Loading from '@/pages/Loading';
import { useTranslation } from '@/shared/i18n';

// ------------------------------------------------------
// 로그인 카드 스타일 (크기 축소 + 반응형)
// ------------------------------------------------------
const LoginCard = styled(Paper)`
  padding: 1.5rem; /* 기존 2rem → 1.5rem */
  border-radius: 14px; /* 기존 16px → 14px */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  background: #fafbfc;
  border: 1px solid #e0e0e0; /* 기존 1.5px → 1px */
  max-width: 400px; /* 기존 450px → 400px */
  width: 100%;
  margin: 0 auto;
  text-align: center;

  /* 모바일(≤600px)일 때 */
  @media (max-width: 600px) {
    padding: 1rem; /* 1.5rem → 1rem */
    max-width: 90%;
    border-radius: 12px;
  }
`;

// ------------------------------------------------------
// 로고 영역 (원래대로: 빈 Typography)
// ------------------------------------------------------
const LogoContainer = styled(Box)`
  margin-bottom: 1.5rem; /* 기존 2rem → 1.5rem */

  /* 모바일(≤600px)일 때 */
  @media (max-width: 600px) {
    margin-bottom: 1rem; /* 1.5rem → 1rem */
  }
`;

// ------------------------------------------------------
// 페이지 제목 스타일 (크기 축소 + 반응형)
// ------------------------------------------------------
const PageTitle = styled(Typography)`
  color: #636363;
  margin-bottom: 0.4rem; /* 기존 0.5rem → 0.4rem */
  font-weight: 700;

  /* 모바일(≤600px)일 때 */
  @media (max-width: 600px) {
    font-size: 1.3rem; /* 기존 1.5rem → 1.3rem */
    margin-bottom: 0.3rem; /* 0.4rem → 0.3rem */
  }
`;

// ------------------------------------------------------
// 부제목 스타일 (크기 축소 + 반응형)
// ------------------------------------------------------
const Subtitle = styled(Typography)`
  color: #888;
  margin-bottom: 1.5rem; /* 기존 2rem → 1.5rem */

  /* 모바일(≤600px)일 때 */
  @media (max-width: 600px) {
    font-size: 0.85rem; /* 기존 0.9rem → 0.85rem */
    margin-bottom: 1rem; /* 1.5rem → 1rem */
  }
`;

// ------------------------------------------------------
// 아이디/비밀번호 입력 영역 스타일 (크기 축소 + 반응형)
// ------------------------------------------------------
const InputBox = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 기존 1.2rem → 1rem */
  margin-bottom: 1.5rem; /* 2rem → 1.5rem */

  /* 모바일(≤600px)일 때 */
  @media (max-width: 600px) {
    gap: 0.8rem; /* 1rem → 0.8rem */
    margin-bottom: 1rem; /* 1.5rem → 1rem */
  }
`;

const LoginInputs = ({ id, setId, password, setPassword }: any) => (
  <InputBox>
    <TextField
      label="ID"
      variant="outlined"
      value={id}
      onChange={e => setId(e.target.value)}
      fullWidth
      autoComplete="username"
      sx={{
        background: 'rgba(255,255,255,0.7)',
        '& .MuiInputBase-input': {
          fontSize: { xs: '0.85rem', sm: '0.95rem' } /* 폰트 크기 축소 */,
        },
        '& .MuiFormLabel-root': {
          fontSize: { xs: '0.8rem', sm: '0.95rem' },
        },
      }}
    />
    <TextField
      label="PASSWORD"
      variant="outlined"
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      fullWidth
      autoComplete="current-password"
      sx={{
        background: 'rgba(255,255,255,0.7)',
        '& .MuiInputBase-input': {
          fontSize: { xs: '0.85rem', sm: '0.95rem' },
        },
        '& .MuiFormLabel-root': {
          fontSize: { xs: '0.8rem', sm: '0.95rem' },
        },
      }}
    />
  </InputBox>
);

// ------------------------------------------------------
// 로그인 액션 버튼 (크기 축소 + 반응형)
// ------------------------------------------------------
const LoginActionButton = ({ onClick, loading }: any) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      size="large"
      onClick={onClick}
      disabled={loading}
      sx={{
        mt: 1,
        borderRadius: 2,
        fontWeight: 700,
        background: '#636363',
        boxShadow: '0 2px 6px #bdbdbd' /* 기존 0 2px 8px → 0 2px 6px */,
        '&:hover': {
          background: '#222',
        },
        // 모바일(≤600px)일 때
        fontSize: { xs: '0.85rem', sm: '0.95rem' },
        py: { xs: '0.7rem', sm: '0.9rem' } /* 세로 패딩 축소 */,
      }}
    >
      {loading ? t('login.loading') : t('login.login')}
    </Button>
  );
};

// ------------------------------------------------------
// 회원가입 버튼 (크기 축소 + 반응형)
// ------------------------------------------------------
const SignupButton = ({ onClick }: any) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="outlined"
      color="secondary"
      fullWidth
      onClick={onClick}
      sx={{
        mt: 2,
        borderRadius: 2,
        fontWeight: 700,
        borderColor: '#636363',
        color: '#636363',
        '&:hover': {
          borderColor: '#636363',
          background: '#fafbfc',
        },
        // 모바일(≤600px)일 때
        fontSize: { xs: '0.85rem', sm: '0.95rem' },
        py: { xs: '0.7rem', sm: '0.9rem' },
      }}
    >
      {t('login.signup')}
    </Button>
  );
};

/**
 * 로그인 페이지 컴포넌트
 * 로직 그대로, 디자인 크기만 전반적으로 줄임
 */
const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, handleLogin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    setLoading(true);
    try {
      const { token, user } = await loginUser({ email: id, password });
      await handleLogin(token, user);
      await useAuthStore.getState().loadUser();
      const updatedUser = useAuthStore.getState().user;
      setLoading(false);
      if (!updatedUser?.isOnBoardDone) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      setError(t('login.loginError'));
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLoginClick();
    }
  };

  // 이미 로그인된 상태라면 대시보드로 리디렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {loading && <Loading />}
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
            // 모바일(≤600px)일 때 좌우 여백 추가
            px: { xs: 2, sm: 0 },
          }}
        >
          <Fade in timeout={1000}>
            <LoginCard elevation={3}>
              <LogoContainer>
                {/* 원래 코드대로 빈 Typography */}
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  sx={{
                    fontWeight: 700,
                    color: '#636363',
                    fontFamily: 'Roboto, Noto Sans KR, sans-serif',
                  }}
                />
              </LogoContainer>

              <PageTitle variant={isMobile ? 'h5' : 'h4'}>{t('login.welcome')}</PageTitle>
              <Subtitle variant="body1">{t('login.calenderDescription')}</Subtitle>

              {error && (
                <Box mb={2}>
                  <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                  </Alert>
                </Box>
              )}

              <Box
                sx={{
                  width: '100%',
                  mt: 1.5 /* 기존 2 → 1.5 */,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.01)' /* 기존 1.02 → 1.01 */,
                  },
                }}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              >
                {/* 아이디/비밀번호 입력 영역 */}
                <LoginInputs id={id} setId={setId} password={password} setPassword={setPassword} />

                {/* 로그인 버튼 */}
                <LoginActionButton onClick={handleLoginClick} loading={loading} />

                {/* 회원가입 버튼 */}
                <SignupButton onClick={handleSignupClick} />
              </Box>

              <Box mt={3}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    // 모바일에서 약관 문구 작게
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  }}
                >
                  {t('login.termsAgreement')}
                </Typography>
              </Box>
            </LoginCard>
          </Fade>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
