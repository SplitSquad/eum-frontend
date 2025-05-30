import React from 'react';
import { Box, Container, styled } from '@mui/material';

// 스타일 컴포넌트
const MainContentArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
}));

interface MainContentLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

/**
 * 메인 콘텐츠 영역을 위한 공통 레이아웃 컴포넌트
 * Container 기반 또는 전체 너비 레이아웃을 지원합니다.
 */
const MainContentLayout: React.FC<MainContentLayoutProps> = ({
  children,
  maxWidth = 'md',
  fullWidth = false,
}) => {
  if (fullWidth) {
    return <MainContentArea>{children}</MainContentArea>;
  }

  return (
    <Container maxWidth={maxWidth} sx={{ py: 4 }}>
      {children}
    </Container>
  );
};

export default MainContentLayout;
//#TODO 정리//
