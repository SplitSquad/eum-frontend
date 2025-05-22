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

// 레인드롭 애니메이션 - 더 자연스럽고 천천히
const rainDrop = keyframes`
  0% {
    transform: translateY(-5vh);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

// 잔물결 확장 애니메이션
const rippleExpand = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

// 배경색 그라데이션 애니메이션 - 밝고 여름다운 색상
const SummerContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'noPadding',
})<SummerBackgroundProps>`
  width: 100%;
  min-height: ${p => (p.noPadding ? '100%' : '100vh')};
  background: linear-gradient(135deg, #67b4de 0%, #c2e3ff 100%);
  padding: ${p => (p.noPadding ? '0' : '2rem 0')};
  position: relative;
  overflow: visible;
  animation: ${fadeInOpacity} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
`;

// 빗방울 컴포넌트 - 더 사실적이고 섬세하게
const Raindrop = styled.div<{
  speed: number;
  delay: number;
  left: string;
  height: number;
  opacity: number;
}>`
  position: absolute;
  top: -10vh;
  width: 1px;
  height: ${props => props.height}px;
  left: ${props => props.left};
  background: linear-gradient(
    to bottom,
    rgba(200, 220, 255, 0),
    rgba(200, 220, 255, ${props => props.opacity})
  );
  transform-origin: center top;
  animation: ${rainDrop} ${props => props.speed}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 2;
`;

// 비 웅덩이 컴포넌트
const RainpuddleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15vh;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  pointer-events: none;
`;

// 빗방울이 떨어져 생기는 파문 효과
const Ripple = styled.div<{ size: number; left: string; delay: number }>`
  position: absolute;
  bottom: ${props => Math.random() * 10 + 2}vh;
  left: ${props => props.left};
  width: ${props => props.size}px;
  height: ${props => props.size / 5}px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform-origin: center;
  transform: scale(0);
  animation: ${rippleExpand} 3s ease-out infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0;
`;

// 구름 요소 (실루엣만 보이는 형태)
const CloudSilhouette = styled.div<{
  width: number;
  height: number;
  top: string;
  left: string;
  opacity: number;
}>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  top: ${props => props.top};
  left: ${props => props.left};
  background-color: rgba(255, 255, 255, ${props => props.opacity});
  border-radius: 50%;
  box-shadow:
    ${props => props.width * 0.4}px ${props => -props.height * 0.1}px
      ${props => props.width * 0.4}px rgba(255, 255, 255, ${props => props.opacity}),
    ${props => -props.width * 0.4}px ${props => -props.height * 0.1}px
      ${props => props.width * 0.4}px rgba(255, 255, 255, ${props => props.opacity}),
    ${props => props.width * 0.2}px ${props => -props.height * 0.3}px
      ${props => props.width * 0.4}px rgba(255, 255, 255, ${props => props.opacity});
  filter: blur(5px);
  z-index: 0;
`;

// 빗방울 생성 함수 - 더 적은 수의 빗방울
const createRaindrops = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    height: Math.random() * 20 + 20, // 20-40px 높이
    left: `${Math.random() * 100}%`,
    speed: Math.random() * 3 + 4, // 4-7초로 더 천천히
    delay: Math.random() * 5, // 0-5초 딜레이
    opacity: Math.random() * 0.3 + 0.5, // 0.5-0.8 불투명도
  }));
};

// 파문 생성 함수
const createRipples = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    size: Math.random() * 20 + 10, // 10-30px 크기
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5, // 0-5초 딜레이
  }));
};

// 구름 생성 함수
const createClouds = (count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    width: Math.random() * 150 + 150, // 150-300px 너비
    height: Math.random() * 60 + 40, // 40-100px 높이
    top: `${Math.random() * 25}%`, // 상단 25%에만 배치
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.2 + 0.1, // 0.1-0.3 투명도 (실루엣만 보이게)
  }));
};

interface SummerBackgroundProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const SummerBackground: React.FC<SummerBackgroundProps> = ({ children, noPadding = false }) => {
  // 빗방울 생성 (양 감소)
  const raindrops = createRaindrops(50);

  // 파문 효과 생성
  const ripples = createRipples(10);

  // 구름 효과 생성
  const clouds = createClouds(5);

  return (
    <SummerContainer noPadding={noPadding}>
      {/* 하늘에 떠다니는 구름 */}
      {clouds.map(cloud => (
        <CloudSilhouette
          key={cloud.id}
          width={cloud.width}
          height={cloud.height}
          top={cloud.top}
          left={cloud.left}
          opacity={cloud.opacity}
        />
      ))}

      {/* 빗방울 */}
      {raindrops.map(drop => (
        <Raindrop
          key={drop.id}
          height={drop.height}
          left={drop.left}
          speed={drop.speed}
          delay={drop.delay}
          opacity={drop.opacity}
        />
      ))}

      {/* 빗물 웅덩이 영역 */}
      <RainpuddleContainer>
        {/* 파문 효과 */}
        {ripples.map(ripple => (
          <Ripple key={ripple.id} size={ripple.size} left={ripple.left} delay={ripple.delay} />
        ))}
      </RainpuddleContainer>

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
    </SummerContainer>
  );
};

export default SummerBackground;
