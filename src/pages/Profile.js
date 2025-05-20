import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Button, Avatar, List, ListItem, ListItemText, Divider, CircularProgress, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuthStore } from '../features/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
// 프로필 카드 스타일링
const ProfileCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 235, 235, 0.8)',
    marginBottom: theme.spacing(4),
}));
// 사용자 아바타 스타일링
const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    margin: '0 auto',
    border: '4px solid #FFD7D7',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));
// 프로필 섹션 스타일링
const ProfileSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));
// 버튼 스타일링
const LogoutButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    borderRadius: 8,
    padding: '10px 24px',
    backgroundColor: '#FF9999',
    color: 'white',
    '&:hover': {
        backgroundColor: '#FF7777',
    },
}));
/**
 * 프로필 페이지 컴포넌트
 * 사용자 정보 표시 및 로그아웃 기능 제공
 *
 * TODO: 백엔드 API 연동 시 실제 사용자 정보를 표시하도록 수정 필요
 */
const Profile = () => {
    const navigate = useNavigate();
    const { user, isLoading, handleLogout } = useAuthStore();
    // 로그아웃 처리
    const onLogout = async () => {
        try {
            await handleLogout();
            navigate('/google-login');
        }
        catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };
    if (isLoading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", children: _jsx(CircularProgress, { size: 60, thickness: 4, sx: { color: '#FF9999' } }) }));
    }
    if (!user) {
        return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsxs(Box, { textAlign: "center", children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "\uC0AC\uC6A9\uC790 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx(Button, { variant: "outlined", onClick: () => navigate('/google-login'), sx: { mt: 2 }, children: "\uB85C\uADF8\uC778\uD558\uB7EC \uAC00\uAE30" })] }) }));
    }
    return (_jsxs(Container, { maxWidth: "md", sx: { py: 4 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, textAlign: "center", fontWeight: 700, children: "\uB0B4 \uD504\uB85C\uD544" }), _jsxs(Box, { mt: 4, children: [_jsxs(ProfileCard, { elevation: 2, children: [_jsxs(Box, { textAlign: "center", children: [_jsx(StyledAvatar, { src: user.picture, children: !user.picture && _jsx(PersonIcon, { sx: { fontSize: 60 } }) }), _jsx(Typography, { variant: "h5", sx: { mt: 2, fontWeight: 600 }, children: user.name || '사용자 이름' }), _jsx(Typography, { variant: "body1", color: "text.secondary", children: user.email || 'email@example.com' }), _jsx(Typography, { variant: "body2", sx: {
                                            mt: 1,
                                            display: 'inline-block',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 10,
                                            bgcolor: '#FFE9E9',
                                            color: '#FF7777',
                                        }, children: user.role === 'admin' ? '관리자' : '일반 사용자' })] }), _jsx(Divider, { sx: { my: 3 } }), _jsxs(ProfileSection, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, fontWeight: 600, children: "\uACC4\uC815 \uC815\uBCF4" }), _jsxs(List, { disablePadding: true, children: [_jsx(ListItem, { sx: { px: 0, py: 1.5 }, children: _jsx(ListItemText, { primary: "\uC774\uBA54\uC77C", secondary: user.email || 'email@example.com', primaryTypographyProps: { fontWeight: 500 } }) }), _jsx(ListItem, { sx: { px: 0, py: 1.5 }, children: _jsx(ListItemText, { primary: "\uAC00\uC785 \uBC29\uBC95", secondary: user.googleId ? 'Google 소셜 로그인' : '이메일 가입', primaryTypographyProps: { fontWeight: 500 } }) }), _jsx(ListItem, { sx: { px: 0, py: 1.5 }, children: _jsx(ListItemText, { primary: "\uACC4\uC815 \uC5ED\uD560", secondary: user.role === 'admin' ? '관리자' : '일반 사용자', primaryTypographyProps: { fontWeight: 500 } }) })] })] }), _jsx(Box, { textAlign: "center", children: _jsx(LogoutButton, { variant: "contained", startIcon: _jsx(LogoutIcon, {}), onClick: onLogout, disableElevation: true, children: "\uB85C\uADF8\uC544\uC6C3" }) })] }), _jsx(Box, { textAlign: "center", mt: 6, mb: 3, children: _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { fontStyle: 'italic' }, children: "\uCC38\uACE0: \uD604\uC7AC \uC784\uC2DC \uAD6C\uD604 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uBC31\uC5D4\uB4DC API \uC5F0\uB3D9 \uD6C4 \uC2E4\uC81C \uC0AC\uC6A9\uC790 \uC815\uBCF4\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4." }) })] })] }));
};
export default Profile;
