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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { loginUser } from '../api/authApi';
import Loading from '@/pages/Loading';
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

// 아이디/비밀번호 입력 영역 스타일
const InputBox = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;

const LoginInputs = ({ id, setId, password, setPassword }) => (
  <InputBox>
    <TextField
      label="아이디"
      variant="outlined"
      value={id}
      onChange={e => setId(e.target.value)}
      fullWidth
      autoComplete="username"
      sx={{ background: 'rgba(255,255,255,0.7)' }}
    />
    <TextField
      label="비밀번호"
      variant="outlined"
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      fullWidth
      autoComplete="current-password"
      sx={{ background: 'rgba(255,255,255,0.7)' }}
    />
  </InputBox>
);

const LoginActionButton = ({ onClick, loading }) => (
  <Button
    variant="contained"
    color="primary"
    fullWidth
    size="large"
    sx={{
      mt: 1,
      borderRadius: 2,
      fontWeight: 700,
      background: 'linear-gradient(90deg, #FFB6B9 0%, #FF9999 100%)',
      boxShadow: '0 2px 8px rgba(255, 170, 165, 0.15)',
      '&:hover': {
        background: 'linear-gradient(90deg, #FF9999 0%, #FFB6B9 100%)',
      },
    }}
    onClick={onClick}
    disabled={loading}
  >
    {loading ? '로그인 중...' : '로그인'}
  </Button>
);

const SignupButton = ({ onClick }) => (
  <Button
    variant="outlined"
    color="secondary"
    fullWidth
    sx={{
      mt: 2,
      borderRadius: 2,
      fontWeight: 700,
      borderColor: '#FFB6B9',
      color: '#FF9999',
      '&:hover': {
        borderColor: '#FF9999',
        background: 'rgba(255, 170, 165, 0.08)',
      },
    }}
    onClick={onClick}
  >
    회원가입
  </Button>
);

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
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    setLoading(true);
    try {
      // 실제 로그인 API 호출
      const { token, user } = await loginUser({ email: id, password });
      // 토큰/유저 정보 저장
      await handleLogin(token, user);
      // 최신 사용자 정보 로드
      await useAuthStore.getState().loadUser();
      const updatedUser = useAuthStore.getState().user;
      setLoading(false);
      // 온보딩 여부에 따라 라우팅
      if (!updatedUser?.isOnBoardDone) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || '로그인 중 오류가 발생했습니다.');
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
              <Subtitle variant="body1">
                일반 로그인 시 구글 캘린더 연동 기능 사용이 어렵습니다.
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
                }}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              >
                {/*아이디 비밀번호 입력 영역*/}
                <LoginInputs id={id} setId={setId} password={password} setPassword={setPassword} />
                {/*로그인 버튼*/}
                <LoginActionButton onClick={handleLoginClick} loading={loading} />
                {/*회원가입 버튼*/}
                <SignupButton onClick={handleSignupClick} />
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
    </>
  );
};

export default LoginPage;
