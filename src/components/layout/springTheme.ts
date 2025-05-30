export type SeasonColors = {
  primary: string;
  secondary: string;
  text: string;
  hover: string;
  background: string;
  gradient: string;
};

export const seasonalColors: Record<string, SeasonColors> = {
  spring: {
    primary: 'rgba(255, 200, 200, 0.9)',
    secondary: 'rgba(255, 150, 150, 0.8)',
    text: '#333333',
    hover: 'rgba(255, 150, 150, 0.2)',
    background: 'rgba(255, 255, 255, 0.9)',
    gradient: 'linear-gradient(90deg, #FFB6B9 0%, #FF9999 100%)',
  },
  hanji: {
    primary: 'rgba(210, 180, 140, 0.85)', // warm light brown
    secondary: 'rgba(180, 140, 90, 0.7)', // deeper brown
    text: '#4B3A1A', // deep brown
    hover: 'rgba(210, 180, 140, 0.18)', // subtle brown hover
    background: 'rgba(249, 246, 241, 0.95)', // hanji ivory
    gradient: 'linear-gradient(90deg, #E9D7B9 0%, #BFA46F 100%)', // light beige to brown
  },
  professional: {
    primary: 'rgba(60, 60, 60, 0.92)', // dark gray
    secondary: 'rgba(30, 30, 30, 0.85)', // almost black
    text: '#222', // deep gray
    hover: 'rgba(60, 60, 60, 0.10)', // subtle gray hover
    background: 'rgba(245, 245, 245, 0.98)', // very light gray
    gradient: 'linear-gradient(90deg, #B0BEC5 0%, #607D8B 100%)', // light blue-gray to dark blue-gray
  },
};
