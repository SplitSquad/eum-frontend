import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import styled from '@emotion/styled';
import LockIcon from '@mui/icons-material/Lock';
// 배경 스타일
const GradientBackground = styled(Box) `
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 245, 245, 1) 0%, rgba(255, 235, 235, 1) 100%);
  padding: 2rem 0;
`;
// 카드 스타일
const StyledPaper = styled(Paper) `
  padding: 3rem;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 235, 235, 0.8);
  max-width: 500px;
  width: 100%;
`;
// 아이콘 컨테이너
const IconContainer = styled(Box) `
  margin-bottom: 2rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 153, 153, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
`;
/**
 * 접근 거부 페이지 컴포넌트
 * 권한이 없는 사용자가 보호된 리소스에 접근할 때 표시됨
 */
const AccessDeniedPage = () => {
    return (_jsx(GradientBackground, { children: _jsx(Container, { maxWidth: "md", children: _jsxs(StyledPaper, { elevation: 3, children: [_jsx(IconContainer, { children: _jsx(LockIcon, { sx: { fontSize: 40, color: '#FF9999' } }) }), _jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, fontWeight: 700, children: "\uC811\uADFC \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx(Typography, { variant: "body1", color: "textSecondary", paragraph: true, children: "\uC774 \uD398\uC774\uC9C0\uC5D0 \uC811\uADFC\uD560 \uC218 \uC788\uB294 \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uD648\uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAC70\uB098 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD558\uC138\uC694." }), _jsxs(Box, { mt: 4, display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", children: [_jsx(Button, { component: Link, to: "/", variant: "contained", sx: {
                                    bgcolor: '#FF9999',
                                    '&:hover': { bgcolor: '#FF7777' },
                                    borderRadius: '8px',
                                    padding: '10px 24px',
                                }, children: "\uD648\uC73C\uB85C \uC774\uB3D9" }), _jsx(Button, { component: Link, to: "/contact", variant: "outlined", sx: {
                                    color: '#555',
                                    borderColor: '#ddd',
                                    '&:hover': { borderColor: '#FF9999', bgcolor: 'rgba(255,153,153,0.05)' },
                                    borderRadius: '8px',
                                    padding: '10px 24px',
                                }, children: "\uACE0\uAC1D\uC13C\uD130" })] })] }) }) }));
};
export default AccessDeniedPage;
