import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, CircularProgress, Typography } from '@mui/material';
/**
 * 로딩 화면 컴포넌트
 */
const Loading = () => {
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100%',
        }, children: [_jsx(CircularProgress, { sx: { color: 'rgba(255, 170, 165, 0.8)', mb: 2 } }), _jsx(Typography, { variant: "h6", color: "textSecondary", children: "\uB85C\uB529 \uC911..." })] }));
};
export default Loading;
