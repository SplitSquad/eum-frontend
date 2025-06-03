import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import GoogleIcon from '@mui/icons-material/Google';
import { getGoogleAuthUrl } from '../api/authApi'; // 실제 구글 로그인 API
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
  backgroundColor: colors.gradient,
  color: colors.buttonText,
  padding: '10px 20px',
  borderRadius: '12px',
  boxShadow: `0 3px 10px ${colors.buttonShadow}`,
  transition: 'all 0.3s ease',
  fontWeight: 600,
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${colors.buttonBorder}`,
  // 기본 폰트 크기
  fontSize: '1rem',
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

  // 모바일(≤600px)일 때 텍스트 폰트 크기 축소
  '@media (max-width: 600px)': {
    fontSize: '0.875rem',
  },
}));

interface GoogleLoginButtonProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  buttonText?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  buttonText = '구글로 계속하기',
}) => {
  const [loading, setLoading] = useState<boolean>(false);
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

  // 실제 구글 로그인 처리 함수
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      // 백엔드 API에서 구글 인증 URL 가져오기
      const authUrl = await getGoogleAuthUrl();

      // 성공 콜백 호출 (선택적)
      if (onSuccess) {
        onSuccess({ status: 'redirecting' });
      }

      // 구글 로그인 페이지로 리디렉션
      window.location.href = authUrl;
    } catch (error) {
      setLoading(false);
      console.error('구글 로그인 URL 가져오기 실패:', error);

      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <ThemedButton
      variant="contained"
      startIcon={!loading && <GoogleIcon />}
      onClick={handleGoogleLogin}
      disabled={loading}
      fullWidth
      colors={colors}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
    </ThemedButton>
  );
};

export default GoogleLoginButton;
