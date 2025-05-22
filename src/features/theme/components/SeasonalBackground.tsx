import React from 'react';
import { useThemeStore } from '../store/themeStore';
import SpringBackground from './SeasonalBackground/SpringBackground';
import SummerBackground from './SeasonalBackground/SummerBackground';
import AutumnBackground from './SeasonalBackground/AutumnBackground';
import WinterBackground from './SeasonalBackground/WinterBackground';

interface SeasonalBackgroundProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

/**
 * 현재 선택된 계절에 따라 적절한 배경 컴포넌트를 렌더링하는 컴포넌트
 */
const SeasonalBackground: React.FC<SeasonalBackgroundProps> = ({ children, noPadding = false }) => {
  const { season } = useThemeStore();
  
  // 현재 계절에 따라 적절한 배경 컴포넌트 선택
  switch (season) {
    case 'summer':
      return <SummerBackground noPadding={noPadding}>{children}</SummerBackground>;
    
    case 'autumn':
      return <AutumnBackground noPadding={noPadding}>{children}</AutumnBackground>;
    
    case 'winter':
      return <WinterBackground noPadding={noPadding}>{children}</WinterBackground>;
    
    case 'spring':
    default:
      // 기본값은 봄 테마
      return <SpringBackground noPadding={noPadding}>{children}</SpringBackground>;
  }
};

export default SeasonalBackground; 