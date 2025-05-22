import React from 'react';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeInOpacity = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fireflyMove = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translate(20px, -10px);
  }
  70% {
    transform: translate(-10px, -15px);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0;
  }
`;

const pulseLight = keyframes`
  0% {
    box-shadow: 0 0 20px 2px rgba(255, 255, 180, 0.3);
    opacity: 0.7;
  }
  50% {
    box-shadow: 0 0 40px 10px rgba(255, 255, 180, 0.4);
    opacity: 0.9;
  }
  100% {
    box-shadow: 0 0 20px 2px rgba(255, 255, 180, 0.3);
    opacity: 0.7;
  }
`;

const gentleSway = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
`;

// 가을 테마 배경 컨테이너 - 깊은 청보라빛 배경
const AutumnContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'noPadding',
})<AutumnBackgroundProps>`
  width: 100%;
  min-height: ${p => (p.noPadding ? '100%' : '100vh')};
  background: linear-gradient(135deg, #2a1b3d 0%, #44336a 100%);
  padding: ${p => (p.noPadding ? '0' : '2rem 0')};
  position: relative;
  overflow: visible;
  animation: ${fadeInOpacity} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
`;

// 달 요소
const Moon = styled.div`
  position: absolute;
  top: 10%;
  right: 10%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 253, 210, 1) 0%, rgba(255, 235, 180, 0.9) 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px 15px rgba(255, 255, 180, 0.3);
  z-index: 1;
  animation: ${pulseLight} 10s ease-in-out infinite;
`;

// 별 요소
const Star = styled.div<{
  size: number;
  top: string;
  left: string;
  opacity: number;
  twinkle: number;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top};
  left: ${props => props.left};
  background-color: #fff;
  border-radius: 50%;
  opacity: ${props => props.opacity};
  z-index: 0;
  animation: ${pulseLight} ${props => props.twinkle}s ease-in-out infinite;
`;

// 반딧불이 효과
const Firefly = styled.div<{
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  color: string;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top};
  left: ${props => props.left};
  background: radial-gradient(circle, ${props => props.color} 0%, rgba(255, 255, 150, 0) 70%);
  border-radius: 50%;
  z-index: 2;
  animation: ${fireflyMove} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  box-shadow: 0 0 5px 1px ${props => props.color};
`;

// 은하수 효과 (미스트 레이어)
const GalaxyMist = styled.div<{ top: string; opacity: number; size: number }>`
  position: absolute;
  top: ${props => props.top};
  left: 0;
  width: 100%;
  height: ${props => props.size}vh;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, ${props => props.opacity * 0.1}) 25%,
    rgba(255, 255, 255, ${props => props.opacity}) 50%,
    rgba(255, 255, 255, ${props => props.opacity * 0.1}) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 0;
  filter: blur(${props => props.size}px);
  transform: rotate(-5deg);
  animation: ${gentleSway} 30s ease-in-out infinite;
`;

// 별 생성 함수
const createStars = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    size: Math.random() * 2 + 1, // 1-3px 크기
    top: `${Math.random() * 70}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8 투명도
    twinkle: Math.random() * 8 + 4, // 4-12초 깜빡임
  }));
};

// 반딧불이 생성 함수
const createFireflies = (count: number) => {
  const colors = [
    'rgba(255, 255, 150, 0.8)',
    'rgba(255, 255, 180, 0.8)',
    'rgba(255, 230, 150, 0.8)',
    'rgba(230, 255, 150, 0.8)',
  ];

  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    size: Math.random() * 5 + 3, // 3-8px 크기
    top: `${Math.random() * 80 + 10}%`, // 화면 10-90% 범위 내
    left: `${Math.random() * 80 + 10}%`, // 화면 10-90% 범위 내
    duration: Math.random() * 10 + 10, // 10-20초 움직임
    delay: Math.random() * 10, // 0-10초 딜레이
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

// 은하수 레이어 생성 함수
const createGalaxyLayers = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    top: `${Math.random() * 60 + 10}%`, // 10-70% 범위
    opacity: Math.random() * 0.1 + 0.05, // 0.05-0.15 투명도
    size: Math.random() * 10 + 15, // 15-25px 크기 (블러 강도 및 높이)
  }));
};

interface AutumnBackgroundProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const AutumnBackground: React.FC<AutumnBackgroundProps> = ({ children, noPadding = false }) => {
  // 별 생성
  const stars = createStars(80);

  // 반딧불이 생성
  const fireflies = createFireflies(20);

  // 은하수 레이어 생성
  const galaxyLayers = createGalaxyLayers(3);

  return (
    <AutumnContainer noPadding={noPadding}>
      {/* 별 */}
      {stars.map(star => (
        <Star
          key={star.id}
          size={star.size}
          top={star.top}
          left={star.left}
          opacity={star.opacity}
          twinkle={star.twinkle}
        />
      ))}

      {/* 은하수 효과 */}
      {galaxyLayers.map(layer => (
        <GalaxyMist key={layer.id} top={layer.top} opacity={layer.opacity} size={layer.size} />
      ))}

      {/* 달 */}
      <Moon />

      {/* 반딧불이 */}
      {fireflies.map(firefly => (
        <Firefly
          key={firefly.id}
          size={firefly.size}
          top={firefly.top}
          left={firefly.left}
          duration={firefly.duration}
          delay={firefly.delay}
          color={firefly.color}
        />
      ))}

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </AutumnContainer>
  );
};

export default AutumnBackground;
