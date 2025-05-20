import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from '@emotion/styled';
import { Alert, Box, Container, Fade, Paper, Typography, useMediaQuery, useTheme, } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton';
import useAuthStore from '../features/auth/store/authStore';
// 로그인 카드 스타일
const LoginCard = styled(Paper) `
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
const LogoContainer = styled(Box) `
  margin-bottom: 2rem;
`;
// 페이지 제목 스타일
const PageTitle = styled(Typography) `
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;
// 부제목 스타일
const Subtitle = styled(Typography) `
  color: #777;
  margin-bottom: 2rem;
`;
/**
 * 로그인 페이지 컴포넌트
 * 봄 테마를 적용한 디자인으로 구글 로그인 기능 제공
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { isAuthenticated, handleLogin } = useAuthStore();
    const [error, setError] = useState(null);
    // 이미 로그인되어 있으면 메인 페이지로 리디렉션
    useEffect(() => {
        // sessionStorage에도 토큰이 있으면 로그인 상태로 간주
        const token = sessionStorage.getItem('auth_token');
        if (isAuthenticated || token) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);
    const handleLoginSuccess = (response) => {
        try {
            // 로그인 응답에서 토큰과 사용자 정보 추출
            const { token, user } = response;
            if (!token || !user) {
                throw new Error('로그인 정보가 올바르지 않습니다.');
            }
            // 전역 상태에 로그인 정보 저장
            handleLogin(token, user);
            // 홈페이지로 리디렉션
            navigate('/home');
        }
        catch (err) {
            setError('로그인 처리 중 오류가 발생했습니다.');
            console.error('로그인 처리 실패:', err);
        }
    };
    const handleLoginError = (error) => {
        setError('구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error('구글 로그인 오류:', error);
    };
    return (_jsx(Container, { maxWidth: "md", children: _jsx(Box, { sx: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 4rem)',
                position: 'relative',
                zIndex: 10,
            }, children: _jsx(Fade, { in: true, timeout: 1000, children: _jsxs(LoginCard, { elevation: 3, children: [_jsx(LogoContainer, { children: _jsx(Typography, { variant: "h4", sx: {
                                    fontWeight: 700,
                                    color: '#FF9999',
                                    fontFamily: '"Roboto", "Noto Sans KR", sans-serif',
                                }, children: "\uBD04\uB0A0\uC758 \uAE30\uC5B5" }) }), _jsx(PageTitle, { variant: isMobile ? 'h5' : 'h4', children: "\uD658\uC601\uD569\uB2C8\uB2E4" }), _jsx(Subtitle, { variant: "body1", children: "\uAD6C\uAE00 \uACC4\uC815\uC73C\uB85C \uAC04\uD3B8\uD558\uAC8C \uB85C\uADF8\uC778\uD558\uC138\uC694" }), error && (_jsx(Box, { mb: 3, children: _jsx(Alert, { severity: "error", onClose: () => setError(null), children: error }) })), _jsx(Box, { sx: {
                                width: '100%',
                                mt: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }, children: _jsx(GoogleLoginButton, { onSuccess: handleLoginSuccess, onError: handleLoginError, buttonText: "\uAD6C\uAE00 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778" }) }), _jsx(Box, { mt: 4, children: _jsx(Typography, { variant: "caption", color: "textSecondary", children: "\uB85C\uADF8\uC778 \uC2DC \uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00 \uBC0F \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68\uC5D0 \uB3D9\uC758\uD558\uAC8C \uB429\uB2C8\uB2E4." }) })] }) }) }) }));
};
export default LoginPage;
