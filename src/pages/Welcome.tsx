import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import styled from '@emotion/styled';
import eum2Image from '@/assets/images/characters/이음이.png';

const WelcomeCard = styled(Paper)`
  padding: 3rem 2rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(255, 170, 165, 0.12);
  background: rgba(255, 255, 255, 0.98);
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EumiImg = styled('img')`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 2rem;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(255, 182, 193, 0.1);
  display: block;
`;

const Welcome: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
      >
        <WelcomeCard elevation={3}>
          <EumiImg src={eum2Image} alt="이음이 캐릭터" />
          <Typography variant="h3" fontWeight={800} color="#E91E63" gutterBottom>
            환영합니다!
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
            이음이와 함께 새로운 여정을 시작해보세요.
            <br />
            다양한 서비스와 커뮤니티가 여러분을 기다리고 있어요.
          </Typography>
        </WelcomeCard>
      </Container>
    </Box>
  );
};

export default Welcome;
