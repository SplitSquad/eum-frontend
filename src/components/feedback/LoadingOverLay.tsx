import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIntroSlider from '@/shared/hooks/UseIntroSlider';
import IntroSlider from '@/components/loading/IntroSlider';
import Slide1 from '@/components/loading/Slide1';
import Slide2 from '@/components/loading/Slide2';
import Slide3 from '@/components/loading/Slide3';
import EumAnimation from '@/assets/animations/loading/Hello_Eum.mp4';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
type Props = {
  isLoaded?: boolean;
};

const SquareContainer = styled.div`
  width: min(50vw, 50vh);
  height: min(45vw, 45vh);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    90deg,
    #fff 0%,
    rgba(255, 216, 139, 0.33) 30%,
    rgba(255, 216, 139, 0.33) 70%,
    #fff 100%
  );
`;

const DoorWrapper = styled.div`
  position: relative;
  width: 60%;
  height: 50%;
  flex: 1 1 auto;
  display: flex;
  align-items: stretch;
  justify-content: center;
  margin: 0 auto;
`;

const LeftDoor = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: stretch;
`;

const RightDoor = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: stretch;
`;

const InnerDoorPanel = styled.div<{ mirrored?: boolean }>`
  width: 100%;
  height: 100%;
  ${props => props.mirrored && 'transform: scaleX(-1);'}
  position: relative;
  background:
    url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" xmlns="http://www.w3.org/2000/svg"><filter id="hanji" x="0" y="0"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2"/></filter><rect width="100%25" height="100%25" fill="white" filter="url(%23hanji)" opacity="0.18"/></svg>'),
    #fff;
  background-size: cover;
  background-blend-mode: lighten;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, #a67c52 2px, transparent 4px),
      linear-gradient(to bottom, #a67c52 2px, transparent 4px);
    background-size: 36px 36px;
    pointer-events: none;
    z-index: 1;
    opacity: 0.7;
  }
  box-shadow:
    inset 0 0 0 4px rgba(0, 0, 0, 0.05),
    0 0 24px rgba(0, 0, 0, 0.08);
  border: 2px solid #b28a59;
`;

const CenterContent = styled.div<{ doorsOpen?: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3.5%;
    pointer-events: none;
    background: linear-gradient(
      to right,
      #000 0%,
      #000 10%,
      rgba(0, 0, 0, 0) 15%,
      rgba(0, 0, 0, 0) 83%,
      #000 83%,
      #000 100%
    );
    z-index: 2;
    opacity: ${props => (props.doorsOpen ? 1 : 0)};
    transition: opacity 0.4s;
  }
`;

const Floor = styled.div`
  width: min(65vw, 65vh);
  height: 15%;
  min-height: 24px;
  max-height: 60px;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow:
    inset 0 -2px 0 rgba(0, 0, 0, 0.08),
    0 0 24px rgba(0, 0, 0, 0.06);
  background-color: #e2b07a;
  background-image:
    repeating-linear-gradient(0deg, #c49a6c 0px, #c49a6c 2px, #b07d4a 2px, #b07d4a 4px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.22), transparent 50%, rgba(0, 0, 0, 0.1)),
    url('https://www.pixeden.com/media/k2/galleries/218/Wood-Pattern-Background.png');
  background-size:
    auto,
    cover,
    100px 100px;
  background-blend-mode: multiply, overlay, normal;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  /* border-radius: 50%; */
`;

const VideoBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.2%;
  width: 100%;
  background: #b28a59;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 3;
`;

const LoadingOverlay = ({ isLoaded = true }: Props) => {
  const totalSlides = 3;
  const { currentIndex, hasCompletedAll } = useIntroSlider(isLoaded, totalSlides);
  const navigate = useNavigate();
  const [doorsOpen, setDoorsOpen] = React.useState(false);

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
    <main
      className="w-screen opacity-100 flex flex-col items-center justify-center"
      style={{ minHeight: '100vh', height: 'auto' }}
    >
      <Floor />
      <SquareContainer>
        <DoorWrapper>
          <LeftDoor
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <InnerDoorPanel />
          </LeftDoor>
          <RightDoor
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <InnerDoorPanel mirrored />
          </RightDoor>
          <CenterContent doorsOpen={doorsOpen}>
            <Video src={EumAnimation} autoPlay muted loop />
            <VideoBar />
          </CenterContent>
        </DoorWrapper>
      </SquareContainer>
      <Floor />
      <IntroSlider currentIndex={currentIndex}>
        <Slide1 />
        <Slide2 />
        <Slide3 />
      </IntroSlider>
    </main>
  );
};

export default LoadingOverlay;
