import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, styled } from '@mui/material';
import Header from '../common/Header';
const PageContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#F8F9FA',
});
const MainContent = styled(Box)({
    flex: 1,
    padding: '24px 0',
});
/**
 * 공통 레이아웃 컴포넌트
 * 다른 개발자가 만든 레이아웃 컴포넌트로 쉽게 교체할 수 있도록 분리함
 */
const DebateLayout = ({ children, title, leftComponent, rightComponent, maxWidth = 'lg', }) => {
    return (_jsxs(PageContainer, { children: [_jsx(Header, { title: title, leftComponent: leftComponent, rightComponent: rightComponent }), _jsx(MainContent, { children: _jsx(Container, { maxWidth: maxWidth, children: children }) })] }));
};
export default DebateLayout;
