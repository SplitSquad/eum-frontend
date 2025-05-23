import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useIntroSlider from '@/shared/hooks/UseIntroSlider';
import IntroSlider from '@/components/loading/IntroSlider';
import Slide1 from '@/components/loading/Slide1';
import Slide2 from '@/components/loading/Slide2';
import Slide3 from '@/components/loading/Slide3';
import LoadingAnimation from '../components/feedback/LoadingAnimation';

type Props = {
  isLoaded?: boolean;
};

const LoadingOverlay = ({ isLoaded = true }: Props) => {
  const totalSlides = 3;
  const { currentIndex, hasCompletedAll } = useIntroSlider(isLoaded, totalSlides);
  const navigate = useNavigate();
  const [doorsOpen, setDoorsOpen] = useState(false);

  // 조건: 로딩 완료 && 슬라이드 전부 돌았으면 로그인 화면으로 이동
  useEffect(() => {
    if (hasCompletedAll) {
      const timeout = setTimeout(() => navigate('/home'), 800);
      return () => clearTimeout(timeout);
    }
  }, [hasCompletedAll, navigate]);

  useEffect(() => {}, [isLoaded]);

  // 문 애니메이션(1.2초) 후 doorsOpen true로
  React.useEffect(() => {
    const timer = setTimeout(() => setDoorsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
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
