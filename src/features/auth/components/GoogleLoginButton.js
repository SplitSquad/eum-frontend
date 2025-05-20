import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, CircularProgress, } from '@mui/material';
import styled from '@emotion/styled';
import GoogleIcon from '@mui/icons-material/Google';
import { getGoogleAuthUrl } from '../api/authApi'; // 실제 구글 로그인 API
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
const BlossomWrapper = styled.div `
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
const GoogleLoginButton = ({ onSuccess, onError, buttonText = '구글로 계속하기', }) => {
    const [loading, setLoading] = useState(false);
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
        }
        catch (error) {
            setLoading(false);
            console.error('구글 로그인 URL 가져오기 실패:', error);
            if (onError) {
                onError(error);
            }
        }
    };
    return (_jsx(BlossomWrapper, { children: _jsx(SpringThemedButton, { variant: "contained", startIcon: !loading && _jsx(GoogleIcon, {}), onClick: handleGoogleLogin, disabled: loading, fullWidth: true, children: loading ? _jsx(CircularProgress, { size: 24, color: "inherit" }) : buttonText }) }));
};
export default GoogleLoginButton;
