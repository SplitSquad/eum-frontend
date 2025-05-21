import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// 봄 테마 스타일 컴포넌트
const SpringThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#555555',
  padding: '10px 20px',
  borderRadius: '12px',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  fontWeight: 600,
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid #FFD7D7',
  '&:hover': {
    backgroundColor: '#FFF5F5',
    boxShadow: '0 5px 15px rgba(255, 170, 180, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-50px',
    left: '-50px',
    right: '-50px',
    bottom: '-50px',
    background: 'radial-gradient(circle, rgba(255,214,214,0.2) 0%, rgba(255,255,255,0) 70%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
  },
  '&:hover:before': {
    opacity: 1,
  },
}));

const BlossomWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;

  @keyframes fallDown {
    0% {
      transform: translateY(-20px) rotate(0deg);
      opacity: 0;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(100px) rotate(360deg);
      opacity: 0;
    }
  }

  &:hover:after {
    content: '🌸';
    position: absolute;
    top: -20px;
    animation: fallDown 2s ease-in-out;
    font-size: 20px;
  }
`;

interface LoginButtonProps {
  buttonText?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ buttonText = '일반 계정으로 로그인' }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // 로그인 페이지 호출 함수
  const handleLogin = async () => {
    /*try {
      setLoading(true);
      // TODO: 실제 로그인 로직 구현
      // 예시: const response = await loginApi(id, password);
      const response = { token: 'dummy', user: { name: '홍길동' } };
      setTimeout(() => {
        setLoading(false);
        if (onSuccess) onSuccess(response);
      }, 1000);
    } catch (error) {
      setLoading(false);
      if (onError) onError(error);
    }*/
    navigate('/login');
  };

  return (
    <BlossomWrapper>
      <SpringThemedButton
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
        fullWidth
        startIcon={!loading && <AccountCircleIcon />}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
      </SpringThemedButton>
    </BlossomWrapper>
  );
};

export default LoginButton;
