import React from 'react';
import { Box, Container, styled, Typography, useTheme, useMediaQuery } from '@mui/material';
import Header, { HeaderProps } from './Header';
import Toast from './Toast';
import PageHeaderText from '@/components/layout/PageHeaderText';

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

export interface DebateLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
  headerProps?: HeaderProps;
}

/**
 * 토론 기능 공통 레이아웃 컴포넌트
 * 다른 개발자가 만든 레이아웃 컴포넌트로 쉽게 교체할 수 있는 구조
 */
const DebateLayout: React.FC<DebateLayoutProps> = ({
  children,
  sidebar,
  showSidebar = true,
  headerProps = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <div>
      {/* 페이지 헤더 */}
      <PageHeaderText isMobile={isMobile}>토론 게시판</PageHeaderText>

      <LayoutContent>
        {showSidebar && sidebar && <Sidebar>{sidebar}</Sidebar>}
        <Main>{children}</Main>
      </LayoutContent>
      <Toast />
    </div>
  );
};

export default DebateLayout;
