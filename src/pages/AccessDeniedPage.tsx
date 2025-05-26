import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import styled from '@emotion/styled';
import LockIcon from '@mui/icons-material/Lock';

// 배경 스타일
const GradientBackground = styled(Box)`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 245, 245, 1) 0%, rgba(255, 235, 235, 1) 100%);
  padding: 2rem 0;
`;

// 카드 스타일
const StyledPaper = styled(Paper)`
  padding: 3rem;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 235, 235, 0.8);
  max-width: 500px;
  width: 100%;
`;

// 아이콘 컨테이너
const IconContainer = styled(Box)`
  margin-bottom: 2rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 153, 153, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
`;

/**
 * 접근 거부 페이지 컴포넌트
 * 권한이 없는 사용자가 보호된 리소스에 접근할 때 표시됨
 */
const AccessDeniedPage: React.FC = () => {
  return (
    <GradientBackground>
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <IconContainer>
            <LockIcon sx={{ fontSize: 40, color: '#FF9999' }} />
          </IconContainer>

          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            접근 권한이 없습니다
          </Typography>

          <Typography variant="body1" color="textSecondary" paragraph>
            이 페이지에 접근할 수 있는 권한이 없습니다. 홈페이지로 돌아가거나 관리자에게 문의하세요.
          </Typography>

          <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                bgcolor: '#FF9999',
                '&:hover': { bgcolor: '#FF7777' },
                borderRadius: '8px',
                padding: '10px 24px',
              }}
            >
              홈으로 이동
            </Button>

            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              sx={{
                color: '#555',
                borderColor: '#ddd',
                '&:hover': { borderColor: '#FF9999', bgcolor: 'rgba(255,153,153,0.05)' },
                borderRadius: '8px',
                padding: '10px 24px',
              }}
            >
              고객센터
            </Button>
          </Box>
        </StyledPaper>
      </Container>
    </GradientBackground>
  );
};

export default AccessDeniedPage;
