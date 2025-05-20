import React from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import error404 from '../assets/images/characters/404error.png';
import styled from '@emotion/styled';

/**
 * 404 페이지 컴포넌트
 */

export const CenteredImg = styled.img`
  display: block;
  margin: 0 auto;
  width: 30%;
  height: 30%;
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ fontSize: '5rem', fontWeight: 'bold', color: '#FF9999' }}
        >
          404
        </Typography>
        <CenteredImg src={error404} alt="404" />
        <Typography variant="h4" gutterBottom>
          페이지를 찾을 수 없습니다
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4 }}>
          요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수 없습니다.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/home')}
          sx={{
            bgcolor: '#FF9999',
            '&:hover': { bgcolor: '#FF7777' },
            px: 4,
          }}
        >
          홈으로 돌아가기
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;
