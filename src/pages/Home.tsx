import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import useAuthStore from '../features/auth/store/authStore';
import { useThemeStore } from '../features/theme/store/themeStore';

// 컴포넌트 가져오기
import UserStatusWidget from '../components/dashboard/UserStatusWidget';
//import UserPreferenceWidget from '../components/dashboard/UserPreferenceWidget';
import KakaoMapWidget from '../components/dashboard/KakaoMapWidget';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import CommunityFeedWidget from '../components/dashboard/CommunityFeedWidget';
import DebateFeedWidget from '../components/dashboard/DebateFeedWidget';
import InfoFeedWidget from '../components/dashboard/InfoFeedWidget';
import PexelsGalleryWidget from '../components/dashboard/PexelsGalleryWidget';
import YoutubeGalleryWidget from '../components/dashboard/YoutubeGalleryWidget';
import { SeasonalBackground } from '../features/theme';
import { useMypageStore } from '../features/mypage/store/mypageStore';

// 플로팅 공 컴포넌트 import
import FloatingPurposeBalls from '../components/dashboard/FloatingPurposeBalls';

/**
 * 홈 페이지 컴포넌트
 */
const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isOnBoardDone = user?.isOnBoardDone;
  const { season } = useThemeStore();

  // 세 번째 행 위젯 랜덤 배치 (매번 페이지 로드 시 랜덤하게 배치)
  const thirdRowWidgets = useMemo(() => {
    const widgets = [
      { component: CommunityFeedWidget, key: 'community' },
      { component: DebateFeedWidget, key: 'debate' },
      { component: InfoFeedWidget, key: 'info' },
    ];

    // 피셔-예이츠 셔플 알고리즘
    const shuffled = [...widgets];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, position: 'relative' }}
    >
      {/* 플로팅 목적 공들 - 전체 화면에 자유롭게 움직임 */}
      <FloatingPurposeBalls />

      {/* 첫 번째 행: 2개 위젯 (UserStatusWidget, KakaoMapWidget) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          height: { md: '450px' },
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '60%' }, height: '100%' }}>
          <UserStatusWidget />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '40%' }, height: '100%' }}>
          <KakaoMapWidget />
        </Box>
      </Box>

      {/* 두 번째 행: 전체 캘린더 */}
      <Box
        sx={{
          height: 'auto',
          minHeight: 'auto',
        }}
      >
        <CalendarWidget />
      </Box>

      {/* 세 번째 행: 3개 위젯 (CommunityFeedWidget, DebateFeedWidget, InfoFeedWidget) - 랜덤 배치 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          height: { lg: '450px' },
          mb: 3,
        }}
      >
        {thirdRowWidgets.map((widget, index) => (
          <Box
            key={widget.key}
            sx={{
              width: { xs: '100%', lg: '33.333%' },
              height: '100%',
            }}
          >
            <widget.component />
          </Box>
        ))}
      </Box>

      {/* 네 번째 행: 2개 위젯 (PexelsGalleryWidget, YoutubeGalleryWidget) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          height: { md: '360px' },
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
  );
};

export default Home;
