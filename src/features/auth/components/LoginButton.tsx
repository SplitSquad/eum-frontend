import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { seasonalColors } from '@/components/layout/springTheme';

const BlossomWrapper = styled.div<{ season: string }>`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  ${({ season }) =>
    season === 'spring'
      ? `
    &:hover:after {
      content: '🌸';
      position: absolute;
      top: -20px;
      animation: fallDown 2s ease-in-out;
      font-size: 20px;
    }
    @keyframes fallDown {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
      50% { opacity: 0.7; }
      100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
    }
  `
      : ''}
`;

const ThemedButton = styled(Button)<{ colors: any }>(({ colors }) => ({
  backgroundColor: colors.buttonBg,
  color: colors.buttonText,
  padding: '10px 20px',
  borderRadius: '12px',
  boxShadow: `0 3px 10px ${colors.buttonShadow}`,
  transition: 'all 0.3s ease',
  fontWeight: 600,
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${colors.buttonBorder}`,
  '&:hover': {
    backgroundColor: colors.buttonHoverBg,
    boxShadow: `0 5px 15px ${colors.buttonShadowHover}`,
    transform: 'translateY(-2px)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-50px',
    left: '-50px',
    right: '-50px',
    bottom: '-50px',
    background:
      colors.buttonBeforeBg ||
      'radial-gradient(circle, rgba(255,214,214,0.2) 0%, rgba(255,255,255,0) 70%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
  },
  '&:hover:before': {
    opacity: 1,
  },
}));

interface LoginButtonProps {
  buttonText?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ buttonText = '일반 계정으로 로그인' }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const baseColors = seasonalColors.professional;
  const colors = {
    buttonBg: baseColors.primary || '#636363',
    buttonText: baseColors.text || '#fff',
    buttonShadow: 'rgba(60,60,60,0.12)',
    buttonBorder: baseColors.primary || '#636363',
    buttonHoverBg: baseColors.secondary || '#222',
    buttonShadowHover: 'rgba(60,60,60,0.18)',
    buttonBeforeBg: baseColors.gradient || undefined,
    gradient: baseColors.gradient || '#636363',
  };

  const handleLogin = async () => {
    navigate('/login');
  };

  return (
    <ThemedButton
      variant="contained"
      onClick={handleLogin}
      disabled={loading}
      fullWidth
      startIcon={!loading && <AccountCircleIcon />}
      colors={colors}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
    </ThemedButton>
  );
};

export default LoginButton;
