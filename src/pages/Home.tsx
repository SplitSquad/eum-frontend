import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

/**
 * 홈 페이지 컴포넌트
 */
const Home: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold' }}
        >
          환영합니다!
        </Typography>
        <Typography variant="body1" paragraph align="center">
          이곳은 홈 페이지입니다. 아직 개발 중인 페이지입니다.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            더 많은 기능이 곧 추가될 예정입니다.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;
