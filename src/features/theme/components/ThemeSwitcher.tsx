import React from 'react';
import { useThemeStore } from '../store/themeStore';

const themes = [
  { key: 'spring', label: '봄(Spring)' },
  { key: 'professional', label: '전문(Professional)' },
  { key: 'hanji', label: '한지(Hanji)' },
] as const;

type ThemeKey = (typeof themes)[number]['key'];

const ThemeSwitcher: React.FC = () => {
  const season = useThemeStore(state => state.season);
  const setSeason = useThemeStore(state => state.setSeason);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {themes.map(theme => (
        <button
          key={theme.key}
          onClick={() => setSeason(theme.key as ThemeKey)}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: season === theme.key ? '2px solid #1976d2' : '1px solid #ccc',
            background: season === theme.key ? '#e3f2fd' : '#fff',
            color: season === theme.key ? '#1976d2' : '#333',
            fontWeight: season === theme.key ? 700 : 400,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s',
          }}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
