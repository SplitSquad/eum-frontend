import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import styled from '@emotion/styled';
import eum2Image from '@/assets/images/characters/이음이.png';
import { useTranslation } from '@/shared/i18n';

const WelcomeCard = styled(Paper)`
  padding: 4rem 2rem;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(250, 251, 252, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  border: 1px solid #e0e0e0;
  backdrop-filter: blur(4px);
`;

const EumiImg = styled('img')`
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 2rem;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(99, 99, 99, 0.1);
  display: block;
  background: #fff;
  border: 1.5px solid #ededed;
`;

const Welcome: React.FC = () => {
  const { t } = useTranslation();
  const titleColor = '#222';
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
      }}
    >
      <WelcomeCard elevation={3}>
        <EumiImg src={eum2Image} alt={t('welcome.characterAlt') || '이음이 캐릭터'} />
        <Typography variant="h3" fontWeight={800} style={{ color: titleColor }} gutterBottom>
          {t('welcome.title')}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: '#555' }}>
          {t('welcome.description')
            .split('\n')
            .map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
        </Typography>
      </WelcomeCard>
    </Container>
  );
};

export default Welcome;
