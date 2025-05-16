import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
// 애니메이션 정의
const fadeIn = keyframes `
  from { opacity: 0; }
  to { opacity: 1; }
`;
const float = keyframes `
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;
const fallingPetal = keyframes `
  0% {
    opacity: 0.9;
    top: -5%;
    transform: translateX(0) rotate(0deg) scale(1);
  }
  25% {
    opacity: 0.95;
    transform: translateX(100px) rotate(45deg) scale(0.95);
  }
  50% {
    opacity: 0.9;
    transform: translateX(50px) rotate(90deg) scale(0.9);
  }
  75% {
    opacity: 0.85;
    transform: translateX(150px) rotate(135deg) scale(0.85);
  }
  100% {
    opacity: 0;
    top: 100%;
    transform: translateX(100px) rotate(180deg) scale(0.8);
  }
`;
const waveAnimation = keyframes `
  0% {
    transform: translateX(-100%) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-50%) translateZ(0) scaleY(0.8);
  }
  100% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
`;
// 스타일 컴포넌트 정의
const SpringContainer = styled.div `
  position: ${props => (props.isFixed ? 'fixed' : 'relative')};
  overflow: hidden;
  min-height: 100%;
  width: 100%;
  padding: ${props => (props.noPadding ? '0' : '20px')};
  background: ${props => `linear-gradient(135deg, rgba(255, 240, 245, ${Math.min(0.9, Math.max(0.4, props.intensity || 0.6))}) 0%, rgba(249, 250, 251, ${Math.min(0.9, Math.max(0.4, props.intensity || 0.6))}) 100%)`};
  animation: ${fadeIn} 0.5s ease-in-out;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const PetalContainer = styled.div `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;
const PetalElement = styled.div `
  position: absolute;
  will-change: transform;
  animation: ${float} 6s ease-in-out infinite;
  z-index: 1;
  opacity: ${props => Math.min(0.9, Math.max(0.6, (props.intensity || 1) * 0.9))};
`;
const CherryPetal = styled.div `
  position: absolute;
  top: -10%;
  left: ${() => `${Math.random() * 100}%`};
  width: ${props => `${15 + (props.intensity || 1) * 10}px`};
  height: ${props => `${15 + (props.intensity || 1) * 8}px`};
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFB6C1' d='M12,2C9.5,2,7.26,3.23,6,5.14c-2.5,3.77-1.76,11.74,5.76,15.62h0.16c0.04,0,0.08,0,0.12,0 s0.08,0,0.12,0h0.16c7.53-3.87,8.26-11.84,5.76-15.62C16.74,3.23,14.5,2,12,2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  filter: drop-shadow(0 2px 5px rgba(255, 182, 193, 0.3));
  z-index: 1;
  will-change: transform;
  animation-name: ${fallingPetal};
  animation-duration: ${props => `${props.duration}s`};
  animation-delay: ${props => `${props.delay}s`};
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  opacity: ${props => Math.min(0.95, Math.max(0.7, (props.intensity || 1) * 0.9))};
`;
const Wave = styled.div `
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100px;
  background: rgba(
    255,
    240,
    245,
    ${props => Math.min(0.7, Math.max(0.3, (props.intensity || 1) * 0.5))}
  );
  border-radius: 50% 50% 0 0;
  animation: ${waveAnimation} 15s linear infinite;
  animation-delay: ${props => `${props.delay}s`};
  transform-origin: 50% 100%;
  z-index: 1;
  opacity: ${props => Math.min(0.7, Math.max(0.3, (props.intensity || 1) * 0.5))};
`;
// 벚꽃 SVG 컴포넌트
const CherryBlossom = ({ size, rotation, intensity = 1.0, }) => {
    // 각 꽃잎의 핑크색 강도를 intensity에 비례하게 조정
    const petalColor = `rgba(255, ${Math.floor(182 - intensity * 30)}, ${Math.floor(193 - intensity * 30)}, ${Math.min(1.0, Math.max(0.7, intensity * 0.95))})`;
    return (_jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: petalColor, style: {
            transform: `rotate(${rotation}deg)`,
            filter: 'drop-shadow(0 2px 3px rgba(255, 182, 193, 0.3))',
        }, children: _jsx("path", { d: "M12,2C9.5,2,7.26,3.23,6,5.14c-2.5,3.77-1.76,11.74,5.76,15.62h0.16c0.04,0,0.08,0,0.12,0 s0.08,0,0.12,0h0.16c7.53-3.87,8.26-11.84,5.76-15.62C16.74,3.23,14.5,2,12,2z" }) }));
};
// 웨이브 이펙트 컴포넌트
const WaveEffect = ({ delay, intensity }) => {
    return _jsx(Wave, { delay: delay, intensity: intensity });
};
// 봄 테마 배경 컴포넌트
const SpringBackground = ({ children, noPadding = false, intensity = 1.0, className, style, isFixed = false, }) => {
    const [petals, setPetals] = useState([]);
    useEffect(() => {
        // intensity에 따라 꽃잎 개수 조절 (더 많은 꽃잎 생성)
        const petalCount = Math.floor(40 * intensity);
        const initialPetals = Array.from({ length: petalCount }).map((_, i) => (_jsx(CherryPetal, { duration: 8 + Math.random() * 14, delay: Math.random() * 15, intensity: intensity }, `initial-petal-${i}`)));
        setPetals(initialPetals);
        // intensity가 0.2 이상일 때만 새 꽃잎 추가 (낮은 값에서도 작동하도록)
        if (intensity >= 0.2) {
            const interval = setInterval(() => {
                setPetals(prev => [
                    ...prev.slice(-60), // 최대 60개로 증가
                    _jsx(CherryPetal, { duration: 10 + Math.random() * 15, delay: 0, intensity: intensity }, `petal-${Date.now()}`),
                ]);
            }, 800 / Math.max(0.5, intensity)); // 더 자주 꽃잎 생성
            return () => clearInterval(interval);
        }
        return undefined;
    }, [intensity]);
    return (_jsxs(SpringContainer, { noPadding: noPadding, intensity: intensity, className: className, style: style, isFixed: isFixed, children: [_jsx(PetalContainer, { children: petals }), _jsx(WaveEffect, { delay: 0, intensity: intensity }), _jsx(WaveEffect, { delay: 1.5, intensity: intensity }), children] }));
};
export default SpringBackground;
