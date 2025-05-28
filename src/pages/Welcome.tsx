import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import styled from '@emotion/styled';
import eum2Image from '@/assets/images/characters/이음이.png';
import { useTranslation } from '@/shared/i18n';
import { useThemeStore } from '@/features/theme/store/themeStore';
import { seasonalColors } from '@/components/layout/springTheme';

const WelcomeCard = styled(Paper)`
  padding: 5rem 3rem;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  box-shadow: none;
  border-radius: 0;
`;

const EumiImg = styled('img')`
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 2.5rem;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(255, 182, 193, 0.1);
  display: block;
`;

const Welcome: React.FC = () => {
  const { t } = useTranslation();
  const season = useThemeStore(state => state.season);
  let titleColor = '#E91E63'; // spring pink
  if (season === 'hanji' || season === 'professional') {
    titleColor = seasonalColors[season]?.primary || '#E91E63';
  }
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        mt: -6,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
      >
        <WelcomeCard elevation={3}>
          <EumiImg src={eum2Image} alt={t('welcome.characterAlt') || '이음이 캐릭터'} />
          <Typography variant="h3" fontWeight={800} style={{ color: titleColor }} gutterBottom>
            {t('welcome.title')}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
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
    </Box>
  );
};

export default Welcome;
