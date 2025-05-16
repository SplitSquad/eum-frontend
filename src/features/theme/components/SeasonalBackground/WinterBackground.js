import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
// 애니메이션 정의
const fadeIn = keyframes `
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const fadeInOpacity = keyframes `
  from { opacity: 0; }
  to { opacity: 1; }
`;
// 눈송이 내리는 애니메이션 - 더 선명하게
const snowfall = keyframes `
  0% {
    transform: translateY(-30px) translateX(-20px) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(105vh) translateX(20px) rotate(360deg);
    opacity: 0;
  }
`;
// 눈 휘날림 애니메이션
const snowSwirl = keyframes `
  0% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(15px) rotate(5deg);
  }
  50% {
    transform: translateX(0) rotate(0deg);
  }
  75% {
    transform: translateX(-15px) rotate(-5deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
`;
// 깜빡임 애니메이션
const twinkle = keyframes `
  0%, 100% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.5;
  }
`;
// 눈 쌓임 애니메이션
const snowAccumulate = keyframes `
  0% {
    transform: scaleY(0);
    opacity: 0.4;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
`;
// 겨울 테마 배경 컨테이너 - 푸른 밤하늘 배경
const WinterContainer = styled(Box, {
    shouldForwardProp: prop => prop !== 'noPadding',
}) `
  width: 100%;
  min-height: ${p => (p.noPadding ? '100%' : '100vh')};
  background: linear-gradient(135deg, #1b2735 0%, #395a7f 100%);
  padding: ${p => (p.noPadding ? '0' : '2rem 0')};
  position: relative;
  overflow: visible;
  animation: ${fadeInOpacity} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
`;
// 눈송이 SVG
const largeSvgSnowflake = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="white">
  <path d="M25,0 L25,50 M0,25 L50,25 M8,8 L42,42 M8,42 L42,8 M14,5 L36,5 M5,14 L5,36 M14,45 L36,45 M45,14 L45,36" 
    stroke="white" stroke-width="2" fill="none" />
</svg>
`;
// 큰 눈송이 컴포넌트
const LargeSnowflake = styled.div `
  position: absolute;
  top: -50px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left};
  background-image: url('data:image/svg+xml;utf8,${encodeURIComponent(largeSvgSnowflake)}');
  background-repeat: no-repeat;
  background-size: contain;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
  z-index: 2;
  opacity: 0;
  animation:
    ${snowfall} ${props => props.duration}s linear infinite,
    ${snowSwirl} ${props => props.rotateSpeed}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;
// 중간 눈송이 컴포넌트
const MediumSnowflake = styled.div `
  position: absolute;
  top: -30px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left};
  background-color: white;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  z-index: 2;
  opacity: 0;
  animation:
    ${snowfall} ${props => props.duration}s linear infinite,
    ${twinkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;
// 작은 눈송이 컴포넌트
const SmallSnowflake = styled.div `
  position: absolute;
  top: -20px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.left};
  background-color: white;
  border-radius: 50%;
  z-index: 2;
  opacity: 0;
  animation:
    ${snowfall} ${props => props.duration}s linear infinite,
    ${twinkle} 2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;
// 별 요소
const Star = styled.div `
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top};
  left: ${props => props.left};
  background-color: white;
  border-radius: 50%;
  opacity: ${props => props.opacity};
  z-index: 0;
  animation: ${twinkle} ${props => 2 + Math.random() * 4}s ease-in-out infinite;
  animation-delay: ${props => Math.random() * 2}s;
  box-shadow: 0 0 ${props => props.size * 2}px ${props => props.size / 2}px rgba(255, 255, 255, 0.8);
`;
// 눈 쌓임 효과
const SnowAccumulation = styled.div `
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), white);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  transform-origin: bottom;
  animation: ${snowAccumulate} 5s ease-out forwards;
  z-index: 3;
  box-shadow: 0 -5px 15px rgba(255, 255, 255, 0.5);
`;
// 큰 눈송이 생성 함수
const createLargeSnowflakes = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
        id: index,
        size: Math.random() * 20 + 30, // 30-50px 크기
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5, // 0-5초 딜레이
        duration: Math.random() * 10 + 15, // 15-25초 내리는 시간
        rotateSpeed: Math.random() * 6 + 6, // 6-12초 회전 속도
    }));
};
// 중간 눈송이 생성 함수
const createMediumSnowflakes = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
        id: index,
        size: Math.random() * 10 + 10, // 10-20px 크기
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 10, // 0-10초 딜레이
        duration: Math.random() * 8 + 10, // 10-18초 내리는 시간
    }));
};
// 작은 눈송이 생성 함수
const createSmallSnowflakes = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
        id: index,
        size: Math.random() * 3 + 2, // 2-5px 크기
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15, // 0-15초 딜레이
        duration: Math.random() * 6 + 8, // 8-14초 내리는 시간
    }));
};
// 별 생성 함수
const createStars = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
        id: index,
        size: Math.random() * 3 + 1, // 1-4px 크기
        top: `${Math.random() * 70}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.5, // 0.5-1.0 불투명도
    }));
};
const WinterBackground = ({ children, noPadding = false }) => {
    // 큰 눈송이 생성
    const largeSnowflakes = createLargeSnowflakes(15);
    // 중간 눈송이 생성
    const mediumSnowflakes = createMediumSnowflakes(30);
    // 작은 눈송이 생성
    const smallSnowflakes = createSmallSnowflakes(60);
    // 별 생성
    const stars = createStars(100);
    return (_jsxs(WinterContainer, { noPadding: noPadding, children: [stars.map(star => (_jsx(Star, { size: star.size, top: star.top, left: star.left, opacity: star.opacity }, star.id))), largeSnowflakes.map((snowflake, index) => (_jsx(LargeSnowflake, { size: snowflake.size, left: snowflake.left, delay: snowflake.delay, duration: snowflake.duration, rotateSpeed: snowflake.rotateSpeed }, `large-${index}`))), mediumSnowflakes.map((snowflake, index) => (_jsx(MediumSnowflake, { size: snowflake.size, left: snowflake.left, delay: snowflake.delay, duration: snowflake.duration }, `medium-${index}`))), smallSnowflakes.map((snowflake, index) => (_jsx(SmallSnowflake, { size: snowflake.size, left: snowflake.left, delay: snowflake.delay, duration: snowflake.duration }, `small-${index}`))), _jsx(SnowAccumulation, {}), _jsx(Box, { sx: {
                    position: 'relative',
                    zIndex: 10,
                    flexGrow: 1,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }, children: children })] }));
};
export default WinterBackground;
