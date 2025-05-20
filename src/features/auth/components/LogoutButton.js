import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, IconButton, Tooltip, styled, Snackbar, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
// Styled logout button with gradient effect
const StyledLogoutButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FF69B4, #E91E63)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        background: 'linear-gradient(45deg, #E91E63, #FF69B4)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
}));
/**
 * 로그아웃 버튼 컴포넌트
 * 아이콘 형태 또는 버튼 형태로 표시 가능
 */
const LogoutButton = ({ variant = 'icon', size = 'medium' }) => {
    const navigate = useNavigate();
    const { handleLogout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const onLogout = async () => {
        try {
            setIsLoading(true);
            await handleLogout();
            setShowSuccess(true);
            // 짧은 딜레이 후 로그인 페이지로 이동
            setTimeout(() => {
                navigate('/google-login');
            }, 1500);
        }
        catch (error) {
            console.error('로그아웃 실패:', error);
            setIsLoading(false);
        }
    };
    if (variant === 'icon') {
        return (_jsxs(_Fragment, { children: [_jsx(Tooltip, { title: "\uB85C\uADF8\uC544\uC6C3", children: _jsx(IconButton, { onClick: onLogout, size: size, disabled: isLoading, sx: { color: 'rgba(233, 30, 99, 0.7)' }, children: _jsx(LogoutIcon, {}) }) }), _jsx(Snackbar, { open: showSuccess, autoHideDuration: 1500, onClose: () => setShowSuccess(false), anchorOrigin: { vertical: 'top', horizontal: 'center' }, children: _jsx(Alert, { severity: "success", sx: { width: '100%' }, children: "\uB85C\uADF8\uC544\uC6C3\uB418\uC5C8\uC2B5\uB2C8\uB2E4" }) })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(StyledLogoutButton, { startIcon: _jsx(LogoutIcon, {}), onClick: onLogout, size: size, disabled: isLoading, variant: "contained", children: isLoading ? '로그아웃 중...' : '로그아웃' }), _jsx(Snackbar, { open: showSuccess, autoHideDuration: 1500, onClose: () => setShowSuccess(false), anchorOrigin: { vertical: 'top', horizontal: 'center' }, children: _jsx(Alert, { severity: "success", sx: { width: '100%' }, children: "\uB85C\uADF8\uC544\uC6C3\uB418\uC5C8\uC2B5\uB2C8\uB2E4" }) })] }));
};
export default LogoutButton;
