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

  /* --- 모바일(≤600px) 가로 너비일 때 --- */
  @media (max-width: 600px) {
    padding: 2rem 1rem;
    max-width: 90%;
    border-radius: 14px;
  }
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

  /* --- 모바일(≤600px) 가로 너비일 때 --- */
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    margin-bottom: 1.5rem;
    border: 1px solid #ededed;
  }
`;

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
        /* --- 모바일에서 간격 조금 더 좁게(선택사항) --- */
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
      <NotFoundCard elevation={3}>
        <ErrorImg src={error404} alt="404" />
        <Typography
          variant="h3"
          fontWeight={800}
          style={{ color: '#222' }}
          gutterBottom
          sx={{
            /* 모바일에서 폰트 크기 축소 */
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          }}
        >
          {t('notFound.title')}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: '#555',
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
          }}
        >
          {t('notFound.description')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/home')}
          sx={{
            bgcolor: '#FF9999',
            '&:hover': { bgcolor: '#FF7777' },
            px: { xs: 3, sm: 4 },
            fontWeight: 700,
            borderRadius: 2,
            mt: 2,
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          {t('notFound.goHome')}
        </Button>
      </NotFoundCard>
    </Container>
  );
};

export default NotFound;
