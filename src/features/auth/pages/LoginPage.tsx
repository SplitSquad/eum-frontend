import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '@/shared/store/UserStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setAuthStatus } = useUserStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      setAuthStatus(true);
      navigate('/');
    }
  }, [isAuthenticated, navigate, setAuthStatus]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: 'Pretendard',
            fontWeight: 700,
            color: '#333',
            mb: 4,
          }}
        >
          EUM
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Pretendard',
            fontWeight: 500,
            color: '#666',
            mb: 6,
          }}
        >
          함께 만들어가는 우리의 이야기
        </Typography>
        <GoogleLoginButton />
      </Box>
    </Container>
  );
};

export default LoginPage;
