import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// 애니메이션 정의
const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
`;

const sway = keyframes`
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(20px) rotate(-5deg);
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

// 봄 테마 배경 스타일 컴포넌트
const SpringContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'noPadding',
})<SpringBackgroundProps>`
  width: 100%;
  min-height: ${p => (p.noPadding ? '100%' : '100vh')};
  background: linear-gradient(135deg, rgba(255, 245, 245, 1) 0%, rgba(255, 235, 235, 1) 100%);
  padding: ${p => (p.noPadding ? '0' : '2rem 0')};
  position: relative;
  overflow: visible;
  animation: ${fadeIn} 0.6s ease-in-out;
  display: flex;
  flex-direction: column;

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

// 추가 꽃잎 요소
const PetalElement = styled.div<{ size: number; top: string; left: string; delay: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top};
  left: ${props => props.left};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD7D7'%3E%3Cpath d='M12 1C8.13 1 5 4.13 5 8c0 6 7 15 7 15s7-9 7-15c0-3.87-3.13-7-7-7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.15;
  animation: ${sway} ${props => 15 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  transform-origin: center bottom;
  pointer-events: none;
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

// 물결 효과
const WaveEffect = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23FFEFEF' fill-opacity='0.5' d='M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,218.7C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-size: 100% 100%;
  opacity: 0.5;
  z-index: 0;
`;

interface SpringBackgroundProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const SpringBackground: React.FC<SpringBackgroundProps> = ({ children, noPadding = false }) => {
  const petalElements = Array.from({ length: 5 }).map((_, index) => ({
    size: Math.floor(Math.random() * 30) + 20,
    top: `${Math.floor(Math.random() * 80) + 10}%`,
    left: `${Math.floor(Math.random() * 80) + 10}%`,
    delay: Math.floor(Math.random() * 5),
  }));

  const [fallingPetals, setFallingPetals] = useState(
    [] as Array<{ id: number; size: number; left: string; duration: number; delay: number }>
  );

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

  return (
    <SpringContainer noPadding={noPadding}>
      {petalElements.map((petal, index) => (
        <PetalElement
          key={index}
          size={petal.size}
          top={petal.top}
          left={petal.left}
          delay={petal.delay}
        />
      ))}
      {fallingPetals.map(petal => (
        <FallingPetal
          key={petal.id}
          size={petal.size}
          left={petal.left}
          duration={petal.duration}
          delay={petal.delay}
        />
      ))}
      <WaveEffect />
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
    </SpringContainer>
  );
};

export default SpringBackground;
