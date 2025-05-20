import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import HelloEumVideo from '../../assets/animations/loading/Hello_Eum.mp4';

// 애니메이션 정의
const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fallingPetal = keyframes`
  0% {
    transform: translateY(-10px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) translateX(100px) rotate(360deg);
    opacity: 0;
  }
`;

// 봄 배경 컨테이너
const SpringContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(227, 242, 253, 0.8) 0%,
    rgba(255, 235, 235, 0.9) 50%,
    rgba(255, 245, 245, 1) 100%
  );
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD7D7'%3E%3Cpath d='M12 1C8.13 1 5 4.13 5 8c0 6 7 15 7 15s7-9 7-15c0-3.87-3.13-7-7-7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.2;
    pointer-events: none;
    z-index: 0;
  }

  &::before {
    top: 10%;
    left: 10%;
    animation: ${float} 20s ease-in-out infinite;
  }

  &::after {
    bottom: 10%;
    right: 10%;
    animation: ${float} 15s ease-in-out infinite reverse;
  }
`;

// 떨어지는 꽃잎 요소
const FallingPetal = styled.div<{ size: number; left: string; duration: number; delay: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: -50px;
  left: ${props => props.left};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFBDBD'%3E%3Cpath d='M12 1C8.13 1 5 4.13 5 8c0 6 7 15 7 15s7-9 7-15c0-3.87-3.13-7-7-7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.2;
  animation: ${fallingPetal} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 1;
`;

// Slide contents
const slideContents = [
  {
    title: '이음이와 함께 시작해요!',
    description: '처음 만나는 한국, 이음이와 함께 천천히 알아가요',
  },
  {
    title: '정보를 불러오고 있어요...',
    description: '조금만 기다려 주세요. 이음이가 열심히 준비 중이에요!',
  },
  {
    title: '곧 만나요!',
    description: '이제 준비가 거의 끝났어요. 로그인 화면으로 이동합니다',
  },
];

interface UnifiedLoadingProps {
  onLoadingComplete?: () => void;
}

const UnifiedLoading: React.FC<UnifiedLoadingProps> = ({ onLoadingComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fallingPetals, setFallingPetals] = useState<
    Array<{ id: number; size: number; left: string; duration: number; delay: number }>
  >([]);

  // 꽃잎 생성
  useEffect(() => {
    const petals = Array.from({ length: 15 }).map((_, index) => ({
      id: index,
      size: Math.floor(Math.random() * 20) + 15,
      left: `${Math.floor(Math.random() * 100)}%`,
      duration: Math.floor(Math.random() * 10) + 10,
      delay: Math.floor(Math.random() * 10),
    }));
    setFallingPetals(petals);

    const interval = setInterval(() => {
      const newPetal = {
        id: Date.now(),
        size: Math.floor(Math.random() * 20) + 15,
        left: `${Math.floor(Math.random() * 100)}%`,
        duration: Math.floor(Math.random() * 10) + 10,
        delay: 0,
      };
      setFallingPetals(prev => [...prev.slice(-14), newPetal]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Change slide every 1.67 seconds (so all 3 slides show within the 5-second video)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideContents.length);
    }, 1670);

    // 비디오가 끝날 때만 로딩 완료 콜백 실행
    const handleVideoEnd = () => {
      if (onLoadingComplete) onLoadingComplete();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      clearInterval(timer);
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [onLoadingComplete]);

  return (
    <SpringContainer>
      {/* 떨어지는 꽃잎들 */}
      {fallingPetals.map(petal => (
        <FallingPetal
          key={petal.id}
          size={petal.size}
          left={petal.left}
          duration={petal.duration}
          delay={petal.delay}
        />
      ))}

      {/* 비디오 및 콘텐츠 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Video container - 세로로 긴 타원형 스타일 적용 */}
        <div className="relative mb-6 flex justify-center">
          <div
            className="overflow-hidden"
            style={{
              width: '280px',
              height: '320px',
              borderRadius: '250px / 280px', // 세로로 긴 타원형 모양으로 설정
              boxShadow: '0 8px 32px rgba(255, 192, 203, 0.2)',
              border: '6px solid rgba(255, 255, 255, 0.7)',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              src={HelloEumVideo}
            />
          </div>
        </div>

        {/* Slides container */}
        <div className="h-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="flex flex-col items-center justify-center text-center px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {slideContents[currentSlide].title}
              </h2>
              <p className="text-base text-gray-500">{slideContents[currentSlide].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Box>
    </SpringContainer>
  );
};

export default UnifiedLoading;
