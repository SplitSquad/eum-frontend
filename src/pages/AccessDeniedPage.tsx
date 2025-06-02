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
`;

/**
 * 접근 거부 페이지 컴포넌트
 * 권한이 없는 사용자가 보호된 리소스에 접근할 때 표시됨
 */
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
      }}
    >
      <AccessDeniedCard elevation={3}>
        <IconContainer>
          <LockIcon sx={{ fontSize: 40, color: '#222' }} />
        </IconContainer>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          {t('accessDenied.title')}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: '#555' }}>
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
              px: 4,
              fontWeight: 700,
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
              '&:hover': { borderColor: '#222', bgcolor: '#f5f5f5' },
              borderRadius: 2,
              px: 4,
              fontWeight: 700,
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
