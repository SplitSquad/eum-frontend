import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import styled from '@emotion/styled';
import error404 from '../assets/images/characters/404error.png';
import { useTranslation } from '../shared/i18n';
import { useNavigate } from 'react-router-dom';

const NotFoundCard = styled(Paper)`
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

const ErrorImg = styled('img')`
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

/**
 * 404 페이지 컴포넌트
 */

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <NotFoundCard elevation={3}>
        <ErrorImg src={error404} alt="404" />
        <Typography variant="h3" fontWeight={800} style={{ color: '#222' }} gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          {t('notFound.title')}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: '#555' }}>
          {t('notFound.description')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/home')}
          sx={{
            bgcolor: '#FF9999',
            '&:hover': { bgcolor: '#FF7777' },
            px: 4,
            fontWeight: 700,
            borderRadius: 2,
            mt: 2,
          }}
        >
          {t('notFound.goHome')}
        </Button>
      </NotFoundCard>
    </Container>
  );
};

export default NotFound;
