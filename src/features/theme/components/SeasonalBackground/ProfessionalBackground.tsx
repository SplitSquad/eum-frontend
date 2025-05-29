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
  min-height: 100vh;
  background: linear-gradient(to bottom, #fff 0%, #f5f5f5 100%);
  padding: ${p => (p.noPadding ? '0' : '2rem 0')};
  padding-bottom: ${p => (p.noPadding ? '0' : '6rem')};
  position: relative;
  box-shadow:
    0 4px 32px 0 rgba(60, 60, 60, 0.07),
    0 1.5px 4px 0 rgba(60, 60, 60, 0.03);
  border-radius: 24px;
  animation: ${fadeIn} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  overflow: visible;
`;

const BackgroundImage = styled('img')`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 90vw;
  height: 90vh;
  min-width: 240px;
  min-height: 180px;
  max-width: 100vw;
  max-height: 100vh;
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
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
