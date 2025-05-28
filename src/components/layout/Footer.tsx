import React from 'react';
import ThemeSwitcher from '../../features/theme/components/ThemeSwitcher';
import { useThemeStore } from '@/features/theme/store/themeStore';
import './Footer.css';

const footerBackgrounds: Record<string, string> = {
  spring: 'linear-gradient(to bottom, rgba(255, 240, 240, 1), rgba(255, 255, 255, 1))',
  hanji: 'linear-gradient(to bottom, #fff 0%, #f9f6f1 100%)',
  professional: 'linear-gradient(to bottom, #f5f5f5 0%, #fff 100%)',
};

function Footer() {
  const season = useThemeStore(state => state.season);
  const bg = footerBackgrounds[season] || footerBackgrounds.spring;

  return (
    <footer className="footer" style={{ ['--footer-bg' as any]: bg }}>
      <div className="footer-container">
        <p className="footer-copyright">© EUM</p>
        <div className="footer-buttons">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
