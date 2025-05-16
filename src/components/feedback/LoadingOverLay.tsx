import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIntroSlider from '@/shared/hooks/UseIntroSlider';
import IntroSlider from '@/components/loading/IntroSlider';
import Slide1 from '@/components/loading/Slide1';
import Slide2 from '@/components/loading/Slide2';
import Slide3 from '@/components/loading/Slide3';

type Props = {
  isLoaded?: boolean;
};

const LoadingOverlay = ({ isLoaded = true }: Props) => {
  const totalSlides = 3;
  const { currentIndex, hasCompletedAll } = useIntroSlider(isLoaded, totalSlides);
  const navigate = useNavigate();

  // 조건: 로딩 완료 && 슬라이드 전부 돌았으면 로그인 화면으로 이동
  useEffect(() => {
    if (hasCompletedAll) {
      const timeout = setTimeout(() => navigate('/home'), 800);
      return () => clearTimeout(timeout);
    }
  }, [hasCompletedAll, navigate]);

  useEffect(() => {}, [isLoaded]);

  return (
    <main className="w-screen opacity-100" style={{ minHeight: '20vh', height: 'auto' }}>
      <IntroSlider currentIndex={currentIndex}>
        <Slide1 />
        <Slide2 />
        <Slide3 />
      </IntroSlider>
    </main>
  );
};

export default LoadingOverlay;
