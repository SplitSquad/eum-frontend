import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../features/auth/store/authStore';
import SchoolIcon from '@mui/icons-material/School';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import { useThemeStore } from '../features/theme/store/themeStore';
/**
 * 홈 페이지 컴포넌트
 */
const Home = () => {
    const { isAuthenticated, user } = useAuthStore();
    const isOnBoardDone = user?.isOnBoardDone;
    const { season } = useThemeStore();
    // 계절에 따른 색상 가져오기
    const getColorByTheme = () => {
        switch (season) {
            case 'spring':
                return '#FFAAA5';
            case 'summer':
                return '#77AADD';
            case 'autumn':
                return '#E8846B';
            case 'winter':
                return '#8795B5';
            default:
                return '#FFAAA5';
        }
    };
    const primaryColor = getColorByTheme();
    console.log('isOnBoardDone:', isOnBoardDone);
    // 온보딩 완료된 사용자를 위한 메시지
    if (isAuthenticated && isOnBoardDone) {
        return (_jsx(Container, { maxWidth: "lg", sx: { py: 8 }, children: _jsx(Typography, { variant: "h5", align: "center", sx: { color: primaryColor }, children: "\uD648\uD398\uC774\uC9C0 \uC5F0\uACB0 \uC608\uC815\uC785\uB2C8\uB2E4." }) }));
    }
    return (_jsx(Container, { maxWidth: "lg", sx: {
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
            zIndex: 5,
        }, children: _jsxs(Paper, { elevation: 3, sx: {
                p: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, align: "center", sx: { fontWeight: 'bold' }, children: "\uD658\uC601\uD569\uB2C8\uB2E4!" }), _jsx(Typography, { variant: "body1", paragraph: true, align: "center", children: "\uD55C\uAD6D \uBC29\uBB38 \uBAA9\uC801\uC5D0 \uB9DE\uAC8C \uD504\uB85C\uD544\uC744 \uC124\uC815\uD558\uACE0 \uB9DE\uCDA4\uD615 \uC815\uBCF4\uB97C \uBC1B\uC544\uBCF4\uC138\uC694." }), isAuthenticated && (_jsxs(Box, { sx: { mt: 4 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, align: "center", children: "\uC628\uBCF4\uB529 \uD504\uB85C\uD544 \uC124\uC815" }), _jsxs(Grid, { container: true, spacing: 2, sx: { mt: 2 }, children: [_jsx(Box, { sx: { width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }, children: _jsx(Button, { component: RouterLink, to: "/onboarding/study", variant: "outlined", fullWidth: true, startIcon: _jsx(SchoolIcon, {}), sx: {
                                            py: 1.5,
                                            borderColor: primaryColor,
                                            color: primaryColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                                backgroundColor: `${primaryColor}10`,
                                            },
                                        }, children: "\uC720\uD559" }) }), _jsx(Box, { sx: { width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }, children: _jsx(Button, { component: RouterLink, to: "/onboarding/travel", variant: "outlined", fullWidth: true, startIcon: _jsx(FlightIcon, {}), sx: {
                                            py: 1.5,
                                            borderColor: primaryColor,
                                            color: primaryColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                                backgroundColor: `${primaryColor}10`,
                                            },
                                        }, children: "\uC5EC\uD589" }) }), _jsx(Box, { sx: { width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }, children: _jsx(Button, { component: RouterLink, to: "/onboarding/living", variant: "outlined", fullWidth: true, startIcon: _jsx(HomeIcon, {}), sx: {
                                            py: 1.5,
                                            borderColor: primaryColor,
                                            color: primaryColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                                backgroundColor: `${primaryColor}10`,
                                            },
                                        }, children: "\uAC70\uC8FC" }) }), _jsx(Box, { sx: { width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }, children: _jsx(Button, { component: RouterLink, to: "/onboarding/job", variant: "outlined", fullWidth: true, startIcon: _jsx(WorkIcon, {}), sx: {
                                            py: 1.5,
                                            borderColor: primaryColor,
                                            color: primaryColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                                backgroundColor: `${primaryColor}10`,
                                            },
                                        }, children: "\uCDE8\uC5C5" }) })] }), _jsx(Box, { sx: { mt: 3, textAlign: 'center' }, children: _jsx(Button, { component: RouterLink, to: "/onboarding", variant: "contained", sx: {
                                    bgcolor: primaryColor,
                                    '&:hover': {
                                        bgcolor: `${primaryColor}dd`,
                                    },
                                }, children: "\uBAA9\uC801 \uC120\uD0DD \uD398\uC774\uC9C0\uB85C \uC774\uB3D9" }) })] })), !isAuthenticated && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', mt: 3 }, children: _jsx(Button, { component: RouterLink, to: "/google-login", variant: "contained", sx: {
                            bgcolor: primaryColor,
                            '&:hover': {
                                bgcolor: `${primaryColor}dd`,
                            },
                        }, children: "\uB85C\uADF8\uC778\uD558\uC5EC \uC2DC\uC791\uD558\uAE30" }) }))] }) }));
};
export default Home;
