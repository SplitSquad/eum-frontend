import React from 'react';
import { Box, Container } from '@mui/material';
import useAuthStore from '../features/auth/store/authStore';
import { useThemeStore } from '../features/theme/store/themeStore';

// 컴포넌트 가져오기
import UserStatusWidget from '../components/dashboard/UserStatusWidget';
import UserPreferenceWidget from '../components/dashboard/UserPreferenceWidget';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import DynamicFeedWidget from '../components/dashboard/DynamicFeedWidget';
import KakaoMapWidget from '../components/dashboard/KakaoMapWidget';
import PexelsGalleryWidget from '../components/dashboard/PexelsGalleryWidget';
import YoutubeGalleryWidget from '../components/dashboard/YoutubeGalleryWidget';
import { SeasonalBackground } from '../features/theme';

/**
 * 홈 페이지 컴포넌트
 */
const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { season } = useThemeStore();

  return (
    <SeasonalBackground noPadding={true}>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
          flexGrow: 1,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
            {/* 첫 번째 행: 2개 위젯 (UserStatusWidget, UserPreferenceWidget) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                height: { md: '450px' }, // 높이 더 증가
              }}
            >
              <Box sx={{ width: { xs: '100%', md: '60%' }, height: '100%' }}>
                <UserStatusWidget />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '40%' }, height: '100%' }}>
                <UserPreferenceWidget />
              </Box>
            </Box>

            {/* 두 번째 행: 1개 위젯 (CalendarWidget) - 높이 증가 */}
            <Box sx={{ width: '100%', height: { md: '450px' } }}>
              <CalendarWidget />
            </Box>

            {/* 세 번째 행: 2개 위젯 (DynamicFeedWidget, KakaoMapWidget) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                height: { md: '500px' }, // 높이 증가
                mb: 3, // 3,4번째 행 사이에만 24px 여백 추가
              }}
            >
              <Box sx={{ width: { xs: '100%', md: '55%' }, height: '100%' }}>
                <DynamicFeedWidget />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '45%' }, height: '100%' }}>
                <KakaoMapWidget />
              </Box>
            </Box>

            {/* 네 번째 행: 2개 위젯 (PexelsGalleryWidget, YoutubeGalleryWidget) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                height: { md: '360px' }, // 높이 조금 증가
              }}
            >
              <Box sx={{ width: { xs: '100%', md: '50%' }, height: '100%' }}>
                <PexelsGalleryWidget />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, height: '100%' }}>
                <YoutubeGalleryWidget />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </SeasonalBackground>
  );
};

export default Home;
