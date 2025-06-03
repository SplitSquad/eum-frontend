import React from 'react';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import styled from '@emotion/styled';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslation } from '@/shared/i18n';
import { useNavigate } from 'react-router-dom';

const AccessDeniedCard = styled(Paper)`
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

  /* --- 모바일(≤600px)일 때 스타일 --- */
  @media (max-width: 600px) {
    padding: 2rem 1rem;
    max-width: 90%;
    border-radius: 14px;
  }
`;

const IconContainer = styled(Box)`
  margin-bottom: 2rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;

  /* --- 모바일(≤600px)일 때 스타일 --- */
  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    margin-bottom: 1.5rem;
  }
`;

const AccessDeniedPage: React.FC = () => {
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
        // 모바일에서 좌우 여백 추가(선택사항)
        px: { xs: 2, sm: 0 },
      }}
    >
      <AccessDeniedCard elevation={3}>
        <IconContainer>
          <LockIcon
            sx={{
              color: '#222',
              // 아이콘 크기도 반응형으로 조정
              fontSize: { xs: 30, sm: 40, md: 48 },
            }}
          />
        </IconContainer>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{
            // 모바일에서는 글씨를 살짝 작게
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          }}
        >
          {t('accessDenied.title')}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: '#555',
            fontSize: { xs: '0.9rem', sm: '1.125rem', md: '1.25rem' },
            lineHeight: { xs: 1.3, sm: 1.4 },
          }}
        >
          {t('accessDenied.description')}
        </Typography>

        <Box mt={2} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: '#222',
              color: '#fff',
              '&:hover': { bgcolor: '#444' },
              borderRadius: 2,
              // 패딩과 폰트 크기를 반응형으로 달리 지정
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 0.8, sm: 1, md: 1.25 },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            }}
          >
            {t('accessDenied.goHome')}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/contact')}
            sx={{
              color: '#555',
              borderColor: '#ddd',
              '&:hover': {
                borderColor: '#222',
                bgcolor: '#f5f5f5',
              },
              borderRadius: 2,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 0.8, sm: 1, md: 1.25 },
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            }}
          >
            {t('accessDenied.contact')}
          </Button>
        </Box>
      </AccessDeniedCard>
    </Container>
  );
};

export default AccessDeniedPage;
