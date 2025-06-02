import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import styled from '@emotion/styled';
import eum2Image from '@/assets/images/characters/이음이.png';
import { useTranslation } from '@/shared/i18n';

const WelcomeCard = styled(Paper)`
  padding: 4rem 2rem;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fafbfc;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  border: 1px solid #e0e0e0;
  backdrop-filter: blur(10px);
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

const Title = styled(Typography)`
  font-size: 2.5rem;
  font-weight: 900;
  color: #222;
  margin-bottom: 2rem;
  line-height: 1.2;
  @media (max-width: 600px) {
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }
`;

const Description = styled(Typography)`
  font-size: 1.18rem;
  color: #444;
  line-height: 2.1;
  margin-bottom: 0.5rem;
  white-space: pre-line;
  letter-spacing: 0.01em;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 1rem;
    line-height: 1.7;
  }
`;

const Welcome: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
    >
      <WelcomeCard elevation={3}>
        <EumiImg src={eum2Image} alt={t('welcome.characterAlt') || '이음이 캐릭터'} />
        <Typography variant="h3" fontWeight={800} style={{ color: '#222' }} gutterBottom>
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
