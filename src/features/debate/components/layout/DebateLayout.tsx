import React, { ReactNode } from 'react';
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

interface DebateLayoutProps {
  children: ReactNode;
  title?: string;
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

/**
 * 공통 레이아웃 컴포넌트
 * 다른 개발자가 만든 레이아웃 컴포넌트로 쉽게 교체할 수 있도록 분리함
 */
const DebateLayout: React.FC<DebateLayoutProps> = ({
  children,
  title,
  leftComponent,
  rightComponent,
  maxWidth = 'lg',
}) => {
  return (
    <PageContainer>
      <Header
        title={title}
        leftComponent={leftComponent}
        rightComponent={rightComponent}
      />
      <MainContent>
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </MainContent>
    </PageContainer>
  );
};

export default DebateLayout; 