import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, styled, Typography, useTheme, useMediaQuery } from '@mui/material';
import Toast from './Toast';
const LayoutRoot = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '20vh',
    height: 'auto',
});
const LayoutContent = styled(Box)({
    display: 'flex',
    flex: 1,
    position: 'relative',
    zIndex: 5,
    padding: 0,
});
const Sidebar = styled(Box)(({ theme }) => ({
    width: '240px',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
    position: 'relative',
    zIndex: 5,
}));
const Main = styled(Box)(({ theme }) => ({
    flex: 1,
    //padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
    //padding: theme.spacing(2),
    },
    position: 'relative',
    zIndex: 5,
}));
/**
 * 토론 기능 공통 레이아웃 컴포넌트
 * 다른 개발자가 만든 레이아웃 컴포넌트로 쉽게 교체할 수 있는 구조
 */
const DebateLayout = ({ children, sidebar, showSidebar = true, headerProps = {}, }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (_jsxs(Container, { maxWidth: "lg", sx: {
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
            zIndex: 5,
        }, children: [_jsx(Box, { sx: {
                    mb: 3,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: 2,
                }, children: _jsx(Typography, { variant: isMobile ? 'h5' : 'h4', component: "h1", sx: {
                        fontWeight: 600,
                        color: '#555',
                        fontFamily: '"Noto Sans KR", sans-serif',
                    }, children: "\uD1A0\uB860 \uAC8C\uC2DC\uD310" }) }), _jsxs(LayoutContent, { children: [showSidebar && sidebar && _jsx(Sidebar, { children: sidebar }), _jsx(Main, { children: children })] }), _jsx(Toast, {})] }));
};
export default DebateLayout;
