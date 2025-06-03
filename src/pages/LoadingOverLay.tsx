import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useIntroSlider from '@/shared/hooks/UseIntroSlider';
import IntroSlider from '@/components/loading/IntroSlider';
import Slide1 from '@/components/loading/Slide1';
import Slide2 from '@/components/loading/Slide2';
import Slide3 from '@/components/loading/Slide3';
import LoadingAnimation from '../components/feedback/LoadingAnimation';
import { useAuthStore } from '@/features/auth';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  isLoaded?: boolean;
};

const LoadingOverlay = ({ isLoaded = true }: Props) => {
  const totalSlides = 3;
  const { currentIndex, hasCompletedAll } = useIntroSlider(isLoaded, totalSlides);
  const navigate = useNavigate();
  const [doorsOpen, setDoorsOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 600px)');

  // 조건: 로딩 완료 && 슬라이드 전부 돌았으면 로그인 상태에 따라 분기
  useEffect(() => {
    if (hasCompletedAll) {
      const timeout = setTimeout(() => {
        navigate('/home');
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [hasCompletedAll, isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {}, [isLoaded]);

  // 문 애니메이션(1.2초) 후 doorsOpen true로
  React.useEffect(() => {
    const timer = setTimeout(() => setDoorsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return isMobile ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <LoadingAnimation doorsOpen={doorsOpen} />
      <div
        style={{
          minHeight: '32vh',
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <IntroSlider currentIndex={currentIndex}>
          <Slide1 />
          <Slide2 />
          <Slide3 />
        </IntroSlider>
      </div>
    </div>
  ) : (
    <>
      <LoadingAnimation doorsOpen={doorsOpen} />
      <IntroSlider currentIndex={currentIndex}>
        <Slide1 />
        <Slide2 />
        <Slide3 />
      </IntroSlider>
    </>
  );
};

export default LoadingOverlay;
