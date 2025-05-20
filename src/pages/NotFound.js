import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Container, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import error404 from '../assets/images/characters/404error.png';
import styled from '@emotion/styled';
/**
 * 404 페이지 컴포넌트
 */
export const CenteredImg = styled.img `
  display: block;
  margin: 0 auto;
  width: 30%;
  height: 30%;
`;
const NotFound = () => {
    const navigate = useNavigate();
    return (_jsx(Container, { maxWidth: "md", sx: { py: 8, textAlign: 'center' }, children: _jsxs(Paper, { elevation: 3, sx: {
                p: 5,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }, children: [_jsx(Typography, { variant: "h1", component: "h1", gutterBottom: true, sx: { fontSize: '5rem', fontWeight: 'bold', color: '#FF9999' }, children: "404" }), _jsx(CenteredImg, { src: error404, alt: "404" }), _jsx(Typography, { variant: "h4", gutterBottom: true, children: "\uD398\uC774\uC9C0\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx(Typography, { variant: "body1", paragraph: true, color: "text.secondary", sx: { mb: 4 }, children: "\uC694\uCCAD\uD558\uC2E0 \uD398\uC774\uC9C0\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uAC70\uB098, \uC774\uB3D9\uB418\uC5C8\uAC70\uB098, \uC77C\uC2DC\uC801\uC73C\uB85C \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx(Button, { variant: "contained", size: "large", onClick: () => navigate('/home'), sx: {
                        bgcolor: '#FF9999',
                        '&:hover': { bgcolor: '#FF7777' },
                        px: 4,
                    }, children: "\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30" })] }) }));
};
export default NotFound;
