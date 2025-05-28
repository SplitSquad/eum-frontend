import React from 'react';
import SpringBackground from './SeasonalBackground/SpringBackground';
import HanjiBackground from './SeasonalBackground/HanjiBackground';
import ProfessionalBackground from './SeasonalBackground/ProfessionalBackground';
import { useThemeStore } from '../store/themeStore';

interface SeasonalBackgroundProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const SeasonalBackground: React.FC<SeasonalBackgroundProps> = ({ children, noPadding = false }) => {
  const season = useThemeStore(state => state.season);

  if (season === 'spring') {
    return <SpringBackground noPadding={noPadding}>{children}</SpringBackground>;
  }
  if (season === 'professional') {
    return <ProfessionalBackground noPadding={noPadding}>{children}</ProfessionalBackground>;
  }
  if (season === 'hanji' || season === 'winter') {
    return <HanjiBackground noPadding={noPadding}>{children}</HanjiBackground>;
  }
  // fallback
  return <SpringBackground noPadding={noPadding}>{children}</SpringBackground>;
};

export default SeasonalBackground;
