import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '@/shared/store/UserStore';
const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { setAuthStatus } = useUserStore();
    React.useEffect(() => {
        if (isAuthenticated) {
            setAuthStatus(true);
            navigate('/');
        }
    }, [isAuthenticated, navigate, setAuthStatus]);
    return (_jsx(Container, { maxWidth: "sm", children: _jsxs(Box, { sx: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                position: 'relative',
                zIndex: 10,
            }, children: [_jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, sx: {
                        fontFamily: 'Pretendard',
                        fontWeight: 700,
                        color: '#333',
                        mb: 4,
                    }, children: "EUM" }), _jsx(Typography, { variant: "h6", sx: {
                        fontFamily: 'Pretendard',
                        fontWeight: 500,
                        color: '#666',
                        mb: 6,
                    }, children: "\uD568\uAED8 \uB9CC\uB4E4\uC5B4\uAC00\uB294 \uC6B0\uB9AC\uC758 \uC774\uC57C\uAE30" }), _jsx(GoogleLoginButton, {})] }) }));
};
export default LoginPage;
