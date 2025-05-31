import React from 'react';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import castleBg from '@/assets/images/backgrounds/castlebg.png';

interface ProfessionalBackgroundProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ProfessionalContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'noPadding',
})<ProfessionalBackgroundProps>`
  width: 100%;
  min-height: 80vh;
  background: linear-gradient(to bottom, #fff 0%, #f5f5f5 100%);
  padding: ${p => (p.noPadding ? '0' : '0')};
  padding-bottom: ${p => (p.noPadding ? '0' : '0')};
  position: relative;
  box-shadow:
    0 4px 32px 0 rgba(60, 60, 60, 0.07),
    0 1.5px 4px 0 rgba(60, 60, 60, 0.03);
  animation: ${fadeIn} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  overflow: visible;
`;

const BackgroundImage = styled('img')`
  position: fixed; /* absolute → fixed */
  top: 0; /* 화면 최상단에 고정 */
  left: 0; /* 화면 최좌측에 고정 */
  width: 90vw; /* 뷰포트 너비 전체 */
  height: 90vh; /* 뷰포트 높이 전체 */
  opacity: 0.5;
  pointer-events: none;
  z-index: 1; /* 컨텐츠 뒤로 보내기 */
  user-select: none;
`;

const ProfessionalBackground: React.FC<ProfessionalBackgroundProps> = ({
  children,
  noPadding = false,
}) => {
  return (
    <ProfessionalContainer noPadding={noPadding}>
      <BackgroundImage src={castleBg} alt="background" />
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
        }}
      >
        {children}
      </Box>
    </ProfessionalContainer>
  );
};

export default ProfessionalBackground;
