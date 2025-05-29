import React from 'react';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HanjiContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'noPadding',
})<HanjiBackgroundProps>`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9f6f1 0%, #fff 100%);
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(120, 90, 40, 0.12) 0px,
      rgba(120, 90, 40, 0.12) 0.5px,
      transparent 0.5px,
      transparent 120px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(120, 90, 40, 0.12) 0px,
      rgba(120, 90, 40, 0.12) 0.5px,
      transparent 0.5px,
      transparent 80px
    );
  background-size:
    80px 160px,
    80px 160px;
  padding: ${p => (p.noPadding ? '0' : '2rem 0')};
  padding-bottom: ${p => (p.noPadding ? '0' : '6rem')};
  position: relative;
  overflow: visible;
  animation: ${fadeIn} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  margin-top: 0;
`;

interface HanjiBackgroundProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const HanjiBackground: React.FC<HanjiBackgroundProps> = ({ children, noPadding = false }) => {
  return (
    <HanjiContainer noPadding={noPadding}>
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
    </HanjiContainer>
  );
};

export default HanjiBackground;
