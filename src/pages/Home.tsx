import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import Grid from '@mui/material/Grid';

import { Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../features/auth/store/authStore';
import SchoolIcon from '@mui/icons-material/School';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import { useThemeStore } from '../features/theme/store/themeStore';

/**
 * 홈 페이지 컴포넌트
 */
const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isOnBoardDone = user?.isOnBoardDone;
  const { season } = useThemeStore();

  // 계절에 따른 색상 가져오기
  const getColorByTheme = () => {
    switch (season) {
      case 'spring':
        return '#FFAAA5';
      case 'summer':
        return '#77AADD';
      case 'autumn':
        return '#E8846B';
      case 'winter':
        return '#8795B5';
      default:
        return '#FFAAA5';
    }
  };

  const primaryColor = getColorByTheme();
  console.log('isOnBoardDone:', isOnBoardDone);
  // 온보딩 완료된 사용자를 위한 메시지
  if (isAuthenticated && isOnBoardDone) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5" align="center" sx={{ color: primaryColor }}>
          홈페이지 연결 예정입니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        position: 'relative',
        zIndex: 5,
      }}
    >
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
          한국 방문 목적에 맞게 프로필을 설정하고 맞춤형 정보를 받아보세요.
        </Typography>

        {isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom align="center">
              온보딩 프로필 설정
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
                <Button
                  component={RouterLink}
                  to="/onboarding/study"
                  variant="outlined"
                  fullWidth
                  startIcon={<SchoolIcon />}
                  sx={{
                    py: 1.5,
                    borderColor: primaryColor,
                    color: primaryColor,
                    '&:hover': {
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                    },
                  }}
                >
                  유학
                </Button>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
                <Button
                  component={RouterLink}
                  to="/onboarding/travel"
                  variant="outlined"
                  fullWidth
                  startIcon={<FlightIcon />}
                  sx={{
                    py: 1.5,
                    borderColor: primaryColor,
                    color: primaryColor,
                    '&:hover': {
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                    },
                  }}
                >
                  여행
                </Button>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
                <Button
                  component={RouterLink}
                  to="/onboarding/living"
                  variant="outlined"
                  fullWidth
                  startIcon={<HomeIcon />}
                  sx={{
                    py: 1.5,
                    borderColor: primaryColor,
                    color: primaryColor,
                    '&:hover': {
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                    },
                  }}
                >
                  거주
                </Button>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1 }}>
                <Button
                  component={RouterLink}
                  to="/onboarding/job"
                  variant="outlined"
                  fullWidth
                  startIcon={<WorkIcon />}
                  sx={{
                    py: 1.5,
                    borderColor: primaryColor,
                    color: primaryColor,
                    '&:hover': {
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                    },
                  }}
                >
                  취업
                </Button>
              </Box>
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/onboarding"
                variant="contained"
                sx={{
                  bgcolor: primaryColor,
                  '&:hover': {
                    bgcolor: `${primaryColor}dd`,
                  },
                }}
              >
                목적 선택 페이지로 이동
              </Button>
            </Box>
          </Box>
        )}

        {!isAuthenticated && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/google-login"
              variant="contained"
              sx={{
                bgcolor: primaryColor,
                '&:hover': {
                  bgcolor: `${primaryColor}dd`,
                },
              }}
            >
              로그인하여 시작하기
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
