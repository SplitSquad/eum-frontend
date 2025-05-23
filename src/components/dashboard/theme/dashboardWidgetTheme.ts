// 대시보드 위젯 공통 파스텔 벚꽃 테마 스타일

export const widgetPaperBase = {
  borderRadius: 4,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.3)',
  minHeight: 320,
  overflow: 'hidden',
  position: 'relative',
  p: 2.5,
};

export const widgetGradients = {
  pink: 'linear-gradient(135deg, #ffe3ec 0%, #f9f6ff 100%)',
  purple: 'linear-gradient(135deg, #f3e7fa 0%, #e3f0ff 100%)',
  yellow: 'linear-gradient(135deg, #fffde4 0%, #f9f6ff 100%)',
  green: 'linear-gradient(135deg, #e0f7fa 0%, #f9fbe7 100%)',
  blue: 'linear-gradient(135deg, #e3f0ff 0%, #f9f6ff 100%)',
};

export const widgetCardBase = {
  borderRadius: 3,
  background: 'rgba(255,255,255,0.7)',
  boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: '0.2s',
  '&:hover': {
    background: 'rgba(255,255,255,0.9)',
    boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.12)',
  },
};

export const widgetTabsBase = {
  background: 'rgba(255,255,255,0.5)',
  borderRadius: 2,
  minHeight: 36,
  '& .MuiTab-root': {
    color: '#b39ddb',
    fontWeight: 600,
    fontSize: '1rem',
    '&.Mui-selected': {
      color: '#e57373',
      background: 'rgba(255,182,193,0.15)',
      borderRadius: 2,
    },
  },
};

export const widgetChipBase = {
  bgcolor: 'rgba(255,182,193,0.15)',
  color: '#e57373',
  fontWeight: 600,
  fontSize: '0.8rem',
  borderRadius: 2,
}; 