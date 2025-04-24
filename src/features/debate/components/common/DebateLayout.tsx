import React from 'react';
import { Box, styled } from '@mui/material';
import Header, { HeaderProps } from './Header';
import SpringBackground from './SpringBackground';

const LayoutRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const LayoutContent = styled(Box)({
  display: 'flex',
  flex: 1,
  position: 'relative',
  zIndex: 5,
});

const Sidebar = styled(Box)(({ theme }) => ({
  width: '240px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(8px)',
  borderRight: '1px solid rgba(238, 238, 238, 0.8)',
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  position: 'relative',
  zIndex: 5,
}));

const Main = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
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
  return (
    <LayoutRoot>
      <SpringBackground noPadding>
        <Header {...headerProps} />
        <LayoutContent>
          {showSidebar && sidebar && <Sidebar>{sidebar}</Sidebar>}
          <Main>{children}</Main>
        </LayoutContent>
      </SpringBackground>
    </LayoutRoot>
  );
};

export default DebateLayout; 